<?php

namespace Tests\Feature\Api\V1\NovelController;

use App\Http\Controllers\Api\V1\NovelController;
use App\Http\Requests\UpdateNovelRequest;
use App\Models\Chapter;
use App\Models\Genre;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NovelControllerUpdateTest extends TestCase
{
    private User $author;

    private Novel $novel;

    private Genre $genre;

    protected array $datas = [
        'title' => 'Nuit virage',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->author = User::factory()->create();
        $this->genre = Genre::factory()->create();
        $this->novel = Novel::factory()->create(['author_id' => $this->author->id]);
        Chapter::factory()->draft()->create([
            'novel_id' => $this->novel->id,
            'author_id' => $this->author->id,
        ]);
        $this->datas['genre_id'] = $this->genre->id;
    }

    private function route(?Novel $novel = null): string
    {
        return '/api/v1/novels/'.($novel ?? $this->novel)->slug;
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(NovelController::class, 'update', UpdateNovelRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(NovelController::class.'@update');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->putJson($this->route(), $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function lets_the_author_retitle_a_novel_still_in_draft(): void
    {
        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['title' => 'Le virage manqué']))
            ->assertOk()
            ->assertJsonPath('title', 'Le virage manqué');

        $this->assertSame('Le virage manqué', $this->novel->refresh()->title);
    }

    #[Test]
    public function lets_the_author_change_the_genre(): void
    {
        $other = Genre::factory()->create();

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['genre_id' => $other->id]))
            ->assertOk()
            ->assertJsonPath('genre.id', $other->id);
    }

    #[Test]
    public function keeps_the_slug_of_a_retitled_novel(): void
    {
        $slug = $this->novel->slug;

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['title' => 'Un tout autre titre']))
            ->assertOk();

        $this->assertSame($slug, $this->novel->refresh()->slug);
    }

    #[Test]
    public function refuses_to_retitle_a_novel_whose_origin_is_published(): void
    {
        $published = Novel::factory()->create(['author_id' => $this->author->id]);
        Chapter::factory()->create([
            'novel_id' => $published->id,
            'author_id' => $this->author->id,
        ]);

        $this->actingAs($this->author)
            ->putJson($this->route($published), $this->getDatas(['title' => 'Trop tard']))
            ->assertForbidden();
    }

    #[Test]
    public function refuses_to_retitle_the_novel_of_someone_else(): void
    {
        $this->actingAs(User::factory()->create())
            ->putJson($this->route(), $this->getDatas(['title' => 'Pas le mien']))
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_banned_author(): void
    {
        $banned = User::factory()->banned()->create();
        $novel = Novel::factory()->create(['author_id' => $banned->id]);
        Chapter::factory()->draft()->create([
            'novel_id' => $novel->id,
            'author_id' => $banned->id,
        ]);

        $this->actingAs($banned)
            ->putJson($this->route($novel), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function title_is_required(): void
    {
        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['title' => '']))
            ->assertJsonValidationErrors(['title']);
    }

    #[Test]
    public function genre_must_exist(): void
    {
        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['genre_id' => 999]))
            ->assertJsonValidationErrors(['genre_id']);
    }
}
