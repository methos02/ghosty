<?php

namespace Tests\Feature\Api\V1\NovelController;

use App\Http\Controllers\Api\V1\NovelController;
use App\Http\Requests\StoreNovelRequest;
use App\Models\Chapter;
use App\Models\Genre;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NovelControllerStoreTest extends TestCase
{
    private const CHAPTER_CONTENT = 'La voiture avait quitté la route au troisième virage, et personne dans le village ne comprenait pourquoi elle roulait encore vers la rivière gelée, phares éteints, sans jamais ralentir une seule fois avant le pont.';

    private string $route = '/api/v1/novels';

    /**
     * @param  array<string, mixed>  $novel
     * @param  array<string, mixed>  $chapter
     * @return array<string, mixed>
     */
    private function payload(array $novel = [], array $chapter = []): array
    {
        return [
            'novel' => array_replace([
                'title' => 'Nuit virage',
                'genre_id' => 1,
            ], $novel),
            'chapter' => array_replace([
                'title' => 'Le premier virage',
                'content' => self::CHAPTER_CONTENT,
                'summary' => 'Une voiture quitte la route.',
            ], $chapter),
        ];
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(NovelController::class, 'store', StoreNovelRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(NovelController::class.'@store');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route, $this->payload())->assertUnauthorized();
    }

    #[Test]
    public function creates_the_novel_and_its_root_chapter(): void
    {
        $author = User::factory()->create();
        $genre = Genre::factory()->create();

        $response = $this->actingAs($author)
            ->postJson($this->route, $this->payload(['genre_id' => $genre->id]));

        $response->assertCreated()
            ->assertJsonPath('title', 'Nuit virage')
            ->assertJsonPath('slug', 'nuit-virage')
            ->assertJsonPath('author.username', $author->username)
            ->assertJsonPath('chapters_count', 1);

        $this->assertDatabaseHas('chapters', [
            'novel_id' => $response->json('id'),
            'parent_id' => null,
            'author_id' => $author->id,
            'title' => 'Le premier virage',
            'depth' => 0,
            'status' => Chapter::STATUS_PUBLISHED,
        ]);
    }

    #[Test]
    public function opens_the_tree_with_a_root_path_carrying_the_chapter_itself(): void
    {
        $author = User::factory()->create();
        $genre = Genre::factory()->create();

        $this->actingAs($author)->postJson($this->route, $this->payload(['genre_id' => $genre->id]));

        $root = Chapter::firstOrFail();

        $this->assertSame("/{$root->id}/", $root->path);
        $this->assertSame([], $root->ancestorIds());
    }

    #[Test]
    public function refuses_a_banned_author(): void
    {
        $author = User::factory()->banned()->create();
        $genre = Genre::factory()->create();

        $this->actingAs($author)
            ->postJson($this->route, $this->payload(['genre_id' => $genre->id]))
            ->assertForbidden();

        $this->assertDatabaseCount('novels', 0);
    }

    #[Test]
    public function title_is_required(): void
    {
        $author = User::factory()->create();
        $genre = Genre::factory()->create();

        $this->actingAs($author)
            ->postJson($this->route, $this->payload(['genre_id' => $genre->id, 'title' => '']))
            ->assertJsonValidationErrors(['novel.title']);
    }

    #[Test]
    public function genre_must_exist(): void
    {
        $author = User::factory()->create();

        $this->actingAs($author)
            ->postJson($this->route, $this->payload(['genre_id' => 999]))
            ->assertJsonValidationErrors(['novel.genre_id']);
    }

    #[Test]
    public function accepts_a_first_chapter_of_a_few_words(): void
    {
        $author = User::factory()->create();
        $genre = Genre::factory()->create();

        $this->actingAs($author)
            ->postJson($this->route, $this->payload(
                ['genre_id' => $genre->id],
                ['content' => 'Il pleut.'],
            ))
            ->assertCreated();

        $this->assertDatabaseCount('novels', 1);
    }
}
