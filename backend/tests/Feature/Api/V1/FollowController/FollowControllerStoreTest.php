<?php

namespace Tests\Feature\Api\V1\FollowController;

use App\Http\Controllers\Api\V1\FollowController;
use App\Models\Chapter;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FollowControllerStoreTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(FollowController::class.'@store');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:follow,chapter'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $chapter = Chapter::factory()->create();

        $this->postJson("/api/v1/chapters/{$chapter->id}/follow")->assertUnauthorized();
    }

    #[Test]
    public function follows_the_branch_headed_by_the_chapter(): void
    {
        $reader = User::factory()->create();
        $chapter = Chapter::factory()->create();

        $this->actingAs($reader)
            ->postJson("/api/v1/chapters/{$chapter->id}/follow")
            ->assertOk()
            ->assertJsonPath('is_followed', true);

        $this->assertDatabaseHas('follows', [
            'user_id' => $reader->id,
            'chapter_id' => $chapter->id,
        ]);
    }

    #[Test]
    public function following_twice_keeps_a_single_follow(): void
    {
        $reader = User::factory()->create();
        $chapter = Chapter::factory()->create();

        $this->actingAs($reader)->postJson("/api/v1/chapters/{$chapter->id}/follow")->assertOk();
        $this->actingAs($reader)->postJson("/api/v1/chapters/{$chapter->id}/follow")->assertOk();

        $this->assertDatabaseCount('follows', 1);
    }

    #[Test]
    public function the_author_can_follow_their_own_chapter(): void
    {
        $chapter = Chapter::factory()->create();

        $this->actingAs($chapter->author)
            ->postJson("/api/v1/chapters/{$chapter->id}/follow")
            ->assertOk();

        $this->assertDatabaseCount('follows', 1);
    }

    #[Test]
    public function refuses_to_follow_a_draft(): void
    {
        $draft = Chapter::factory()->draft()->create();

        $this->actingAs($draft->author)
            ->postJson("/api/v1/chapters/{$draft->id}/follow")
            ->assertForbidden();

        $this->assertDatabaseCount('follows', 0);
    }

    #[Test]
    public function refuses_a_banned_reader(): void
    {
        $banned = User::factory()->banned()->create();
        $chapter = Chapter::factory()->create();

        $this->actingAs($banned)
            ->postJson("/api/v1/chapters/{$chapter->id}/follow")
            ->assertForbidden();
    }

    #[Test]
    public function answers_not_found_for_an_unknown_chapter(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/v1/chapters/999/follow')
            ->assertNotFound();
    }
}
