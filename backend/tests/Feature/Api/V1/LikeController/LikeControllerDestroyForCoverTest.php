<?php

namespace Tests\Feature\Api\V1\LikeController;

use App\Http\Controllers\Api\V1\LikeController;
use App\Models\Like;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LikeControllerDestroyForCoverTest extends TestCase
{
    private User $reader;

    private Novel $novel;

    private NovelCover $cover;

    protected function setUp(): void
    {
        parent::setUp();

        $this->reader = User::factory()->create();
        $this->novel = Novel::factory()->create();
        $this->cover = NovelCover::factory()->on($this->novel)->liked(2)->create();
        Like::factory()->on($this->cover)->create(['user_id' => $this->reader->id]);
    }

    private function route(): string
    {
        return "/api/v1/covers/{$this->cover->id}/like";
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(LikeController::class.'@destroyForCover');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:like'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->deleteJson($this->route())->assertUnauthorized();
    }

    #[Test]
    public function removes_the_like_and_returns_the_fresh_count(): void
    {
        $this->actingAs($this->reader)
            ->deleteJson($this->route())
            ->assertOk()
            ->assertJsonPath('cover.id', $this->cover->id)
            ->assertJsonPath('cover.is_liked', false)
            ->assertJsonPath('cover.like_count', 1);

        $this->assertDatabaseMissing('likes', [
            'user_id' => $this->reader->id,
            'likeable_id' => $this->cover->id,
        ]);
    }

    #[Test]
    public function removing_an_absent_like_changes_nothing(): void
    {
        $this->actingAs(User::factory()->create())
            ->deleteJson($this->route())
            ->assertOk()
            ->assertJsonPath('cover.like_count', 2);
    }

    #[Test]
    public function losing_the_lead_hands_the_official_cover_to_the_most_liked_rival(): void
    {
        $rival = NovelCover::factory()->on($this->novel)->liked(2)->create(['created_at' => now()->subDay()]);
        $this->novel->forceFill(['official_cover_id' => $this->cover->id])->save();

        $this->actingAs($this->reader)
            ->deleteJson($this->route())
            ->assertOk()
            ->assertJsonPath('official_cover_id', $rival->id);
    }
}
