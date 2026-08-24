<?php

namespace Tests\Feature\Api\V1\LikeController;

use App\Http\Controllers\Api\V1\LikeController;
use App\Models\Chapter;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LikeControllerDestroyTest extends TestCase
{
    private User $reader;

    private Chapter $chapter;

    protected function setUp(): void
    {
        parent::setUp();

        $this->reader = User::factory()->create(['created_at' => now()->subWeek()]);
        $this->chapter = Chapter::factory()->create();
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(LikeController::class.'@destroy');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:like'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->deleteJson("/api/v1/chapters/{$this->chapter->id}/like")->assertUnauthorized();
    }

    #[Test]
    public function withdrawing_rolls_the_count_back(): void
    {
        $this->actingAs($this->reader)->postJson("/api/v1/chapters/{$this->chapter->id}/like")->assertOk();

        $this->actingAs($this->reader)
            ->deleteJson("/api/v1/chapters/{$this->chapter->id}/like")
            ->assertOk()
            ->assertJsonPath('is_liked', false)
            ->assertJsonPath('like_count', 0)
            ->assertJsonMissingPath('branch_like_count');

        $this->assertDatabaseCount('likes', 0);
    }

    #[Test]
    public function withdrawing_a_support_that_was_never_given_leaves_the_count_alone(): void
    {
        $supporter = User::factory()->create(['created_at' => now()->subWeek()]);
        $this->actingAs($supporter)->postJson("/api/v1/chapters/{$this->chapter->id}/like")->assertOk();

        $this->actingAs($this->reader)
            ->deleteJson("/api/v1/chapters/{$this->chapter->id}/like")
            ->assertOk()
            ->assertJsonPath('like_count', 1);

        $this->assertDatabaseCount('likes', 1);
    }
}
