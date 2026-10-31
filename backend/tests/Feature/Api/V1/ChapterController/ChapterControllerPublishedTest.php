<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Http\Controllers\Api\V1\ChapterController;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerPublishedTest extends TestCase
{
    private string $route = '/api/v1/me/chapters';

    private User $author;

    protected function setUp(): void
    {
        parent::setUp();

        $this->author = User::factory()->create();
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ChapterController::class.'@published');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson($this->route)->assertUnauthorized();
    }

    #[Test]
    public function groups_the_published_chapters_of_the_author_by_novel(): void
    {
        $novel = Novel::factory()->create(['title' => 'Nuit virage']);
        $root = Chapter::factory()->create([
            'novel_id' => $novel->id,
            'author_id' => $this->author->id,
            'title' => 'Le virage',
        ]);
        $continuation = Chapter::factory()->continuing($root)->create([
            'author_id' => $this->author->id,
            'title' => 'La route inverse',
            'published_at' => now()->addDay(),
        ]);

        $response = $this->actingAs($this->author)->getJson($this->route);

        $response->assertOk()
            ->assertJsonCount(1, 'novels')
            ->assertJsonPath('novels.0.slug', $novel->slug)
            ->assertJsonPath('novels.0.title', 'Nuit virage')
            ->assertJsonPath('novels.0.chapters.*.id', [$root->id, $continuation->id])
            ->assertJsonPath('novels.0.chapters.1.title', 'La route inverse');
    }

    #[Test]
    public function orders_the_novels_by_title(): void
    {
        $second = Chapter::factory()->create([
            'author_id' => $this->author->id,
            'novel_id' => Novel::factory()->create(['title' => 'Zénith'])->id,
        ]);
        $first = Chapter::factory()->create([
            'author_id' => $this->author->id,
            'novel_id' => Novel::factory()->create(['title' => 'Aube'])->id,
        ]);

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('novels.*.id', [$first->novel_id, $second->novel_id]);
    }

    #[Test]
    public function leaves_out_the_chapters_of_other_authors_in_the_same_novel(): void
    {
        $root = Chapter::factory()->create(['author_id' => $this->author->id]);
        Chapter::factory()->continuing($root)->create();

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('novels.0.chapters.*.id', [$root->id]);
    }

    #[Test]
    public function leaves_out_the_novels_where_the_author_only_has_drafts(): void
    {
        Chapter::factory()->draft()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonCount(0, 'novels');
    }

    #[Test]
    public function leaves_out_the_drafts_of_a_novel_with_published_chapters(): void
    {
        $root = Chapter::factory()->create(['author_id' => $this->author->id]);
        Chapter::factory()->continuing($root)->draft()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('novels.0.chapters.*.id', [$root->id]);
    }

    #[Test]
    public function leaves_out_the_chapters_hidden_by_moderation(): void
    {
        Chapter::factory()->hidden()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonCount(0, 'novels');
    }

    #[Test]
    public function leaves_the_full_text_out_of_the_list(): void
    {
        Chapter::factory()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('novels.0.chapters.0.title', fn ($title) => $title !== null)
            ->assertJsonMissingPath('novels.0.chapters.0.content');
    }
}
