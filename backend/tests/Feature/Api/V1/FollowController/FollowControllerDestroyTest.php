<?php

namespace Tests\Feature\Api\V1\FollowController;

use App\Http\Controllers\Api\V1\FollowController;
use App\Models\Chapter;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FollowControllerDestroyTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(FollowController::class.'@destroy');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $chapter = Chapter::factory()->create();

        $this->deleteJson("/api/v1/chapters/{$chapter->id}/follow")->assertUnauthorized();
    }

    #[Test]
    public function stops_following_the_branch(): void
    {
        $reader = User::factory()->create();
        $chapter = Chapter::factory()->create();
        Follow::factory()->by($reader)->on($chapter)->create();

        $this->actingAs($reader)
            ->deleteJson("/api/v1/chapters/{$chapter->id}/follow")
            ->assertOk()
            ->assertJsonPath('is_followed', false);

        $this->assertDatabaseCount('follows', 0);
    }

    #[Test]
    public function keeps_the_follows_of_other_readers(): void
    {
        $reader = User::factory()->create();
        $chapter = Chapter::factory()->create();
        $other = Follow::factory()->on($chapter)->create();

        $this->actingAs($reader)
            ->deleteJson("/api/v1/chapters/{$chapter->id}/follow")
            ->assertOk();

        $this->assertDatabaseHas('follows', ['id' => $other->id]);
    }
}
