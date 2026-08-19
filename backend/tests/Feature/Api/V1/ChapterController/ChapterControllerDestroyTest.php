<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Http\Controllers\Api\V1\ChapterController;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerDestroyTest extends TestCase
{
    private User $author;

    protected function setUp(): void
    {
        parent::setUp();

        $this->author = User::factory()->create();
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ChapterController::class.'@destroy');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $draft = Chapter::factory()->draft()->create();

        $this->deleteJson("/api/v1/chapters/{$draft->id}")->assertUnauthorized();
    }

    #[Test]
    public function discards_a_draft_continuation(): void
    {
        $root = Chapter::factory()->create();
        $draft = Chapter::factory()->draft()->continuing($root)->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->deleteJson("/api/v1/chapters/{$draft->id}")
            ->assertOk();

        $this->assertDatabaseMissing('chapters', ['id' => $draft->id]);
        $this->assertDatabaseHas('chapters', ['id' => $root->id]);
    }

    #[Test]
    public function discards_the_novel_along_with_its_draft_origin(): void
    {
        $novel = Novel::factory()->create();
        $draft = Chapter::factory()->draft()->create([
            'novel_id' => $novel->id,
            'author_id' => $this->author->id,
        ]);

        $this->actingAs($this->author)
            ->deleteJson("/api/v1/chapters/{$draft->id}")
            ->assertOk();

        $this->assertDatabaseMissing('novels', ['id' => $novel->id]);
        $this->assertDatabaseMissing('chapters', ['id' => $draft->id]);
    }

    #[Test]
    public function refuses_to_discard_a_published_chapter(): void
    {
        $published = Chapter::factory()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->deleteJson("/api/v1/chapters/{$published->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('chapters', ['id' => $published->id]);
    }

    #[Test]
    public function refuses_to_discard_the_draft_of_someone_else(): void
    {
        $draft = Chapter::factory()->draft()->create();

        $this->actingAs($this->author)
            ->deleteJson("/api/v1/chapters/{$draft->id}")
            ->assertForbidden();
    }
}
