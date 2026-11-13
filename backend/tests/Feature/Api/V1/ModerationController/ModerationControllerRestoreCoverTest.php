<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Http\Controllers\Api\V1\ModerationController;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerRestoreCoverTest extends TestCase
{
    private User $moderator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
    }

    private function route(NovelCover $cover): string
    {
        return "/api/v1/moderation/covers/{$cover->id}/restore";
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@restoreCover');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report', 'can:restore,cover'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route(NovelCover::factory()->hidden()->create()))->assertUnauthorized();
    }

    #[Test]
    public function restores_a_hidden_cover(): void
    {
        $hidden = NovelCover::factory()->hidden()->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($hidden))
            ->assertOk();

        $this->assertDatabaseHas('novel_covers', ['id' => $hidden->id, 'status' => NovelCover::STATUS_PUBLISHED]);
    }

    #[Test]
    public function a_restored_cover_with_more_likes_becomes_official_again(): void
    {
        $novel = Novel::factory()->create();
        $official = NovelCover::factory()->on($novel)->liked(1)->create();
        $hidden = NovelCover::factory()->on($novel)->liked(4)->hidden()->create();
        $novel->forceFill(['official_cover_id' => $official->id])->save();

        $this->actingAs($this->moderator)
            ->postJson($this->route($hidden))
            ->assertOk();

        $this->assertDatabaseHas('novels', ['id' => $novel->id, 'official_cover_id' => $hidden->id]);
    }

    #[Test]
    public function refuses_a_visible_cover(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route(NovelCover::factory()->create()))
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route(NovelCover::factory()->hidden()->create()))
            ->assertForbidden();
    }
}
