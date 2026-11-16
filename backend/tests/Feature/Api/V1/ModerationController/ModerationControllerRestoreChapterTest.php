<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Http\Controllers\Api\V1\ModerationController;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerRestoreChapterTest extends TestCase
{
    private User $moderator;

    private Novel $novel;

    private Chapter $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
        $this->novel = Novel::factory()->create(['chapter_count' => 1]);
        $this->root = Chapter::factory()->create(['novel_id' => $this->novel->id]);
    }

    private function route(Chapter $chapter): string
    {
        return "/api/v1/moderation/chapters/{$chapter->id}/restore";
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@restoreChapter');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report', 'can:restore,chapter'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $hidden = Chapter::factory()->continuing($this->root)->hidden()->create();

        $this->postJson($this->route($hidden))->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $hidden = Chapter::factory()->continuing($this->root)->hidden()->create();

        $this->actingAs(User::factory()->create())
            ->postJson($this->route($hidden))
            ->assertForbidden();
    }

    #[Test]
    public function restores_a_hidden_chapter_and_its_counters(): void
    {
        $hidden = Chapter::factory()->continuing($this->root)->hidden()->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($hidden))
            ->assertOk();

        $this->assertDatabaseHas('chapters', ['id' => $hidden->id, 'status' => Chapter::STATUS_PUBLISHED]);
        $this->assertDatabaseHas('chapters', ['id' => $this->root->id, 'continuations_count' => 1]);
        $this->assertDatabaseHas('novels', ['id' => $this->novel->id, 'chapter_count' => 2]);
    }

    #[Test]
    public function refuses_a_published_chapter(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->root))
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_chapter_whose_parent_is_not_published(): void
    {
        $hiddenParent = Chapter::factory()->continuing($this->root)->hidden()->create();
        $hiddenChild = Chapter::factory()->continuing($hiddenParent)->hidden()->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($hiddenChild))
            ->assertForbidden();

        $this->assertDatabaseHas('chapters', ['id' => $hiddenChild->id, 'status' => Chapter::STATUS_HIDDEN]);
    }
}
