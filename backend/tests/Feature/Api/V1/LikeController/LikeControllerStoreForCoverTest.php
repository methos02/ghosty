<?php

namespace Tests\Feature\Api\V1\LikeController;

use App\Enums\NotificationType;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\LikeController;
use App\Models\Like;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LikeControllerStoreForCoverTest extends TestCase
{
    private User $reader;

    private Novel $novel;

    private NovelCover $cover;

    protected function setUp(): void
    {
        parent::setUp();

        $this->reader = User::factory()->create(['created_at' => now()->subWeek()]);
        $this->novel = Novel::factory()->create();
        $this->cover = NovelCover::factory()->on($this->novel)->create();
    }

    private function route(NovelCover $cover): string
    {
        return "/api/v1/covers/{$cover->id}/like";
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(LikeController::class.'@storeForCover');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:like'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route($this->cover))->assertUnauthorized();
    }

    #[Test]
    public function records_the_like_and_returns_the_fresh_count(): void
    {
        $this->actingAs($this->reader)
            ->postJson($this->route($this->cover))
            ->assertOk()
            ->assertJsonPath('cover.id', $this->cover->id)
            ->assertJsonPath('cover.is_liked', true)
            ->assertJsonPath('cover.like_count', 1)
            ->assertJsonPath('moved_from', null);

        $this->assertDatabaseHas('likes', [
            'user_id' => $this->reader->id,
            'likeable_type' => 'novel_cover',
            'likeable_id' => $this->cover->id,
        ]);
    }

    #[Test]
    public function liking_another_cover_of_the_same_novel_moves_the_like(): void
    {
        $previouslyLiked = NovelCover::factory()->on($this->novel)->liked(1)->create();
        Like::factory()->on($previouslyLiked)->create(['user_id' => $this->reader->id]);

        $this->actingAs($this->reader)
            ->postJson($this->route($this->cover))
            ->assertOk()
            ->assertJsonPath('cover.like_count', 1)
            ->assertJsonPath('moved_from.id', $previouslyLiked->id)
            ->assertJsonPath('moved_from.is_liked', false)
            ->assertJsonPath('moved_from.like_count', 0);

        $this->assertDatabaseMissing('likes', [
            'user_id' => $this->reader->id,
            'likeable_id' => $previouslyLiked->id,
        ]);
    }

    #[Test]
    public function a_like_on_a_cover_of_another_novel_is_kept(): void
    {
        $otherNovelCover = NovelCover::factory()->liked(1)->create();
        Like::factory()->on($otherNovelCover)->create(['user_id' => $this->reader->id]);

        $this->actingAs($this->reader)
            ->postJson($this->route($this->cover))
            ->assertOk()
            ->assertJsonPath('moved_from', null);

        $this->assertDatabaseHas('likes', [
            'user_id' => $this->reader->id,
            'likeable_id' => $otherNovelCover->id,
        ]);
    }

    #[Test]
    public function liking_the_same_cover_twice_counts_once(): void
    {
        $this->actingAs($this->reader)->postJson($this->route($this->cover))->assertOk();

        $this->actingAs($this->reader)
            ->postJson($this->route($this->cover))
            ->assertOk()
            ->assertJsonPath('cover.like_count', 1);
    }

    #[Test]
    public function a_cover_with_strictly_more_likes_becomes_official(): void
    {
        $official = NovelCover::factory()->on($this->novel)->create();
        $this->novel->forceFill(['official_cover_id' => $official->id])->save();

        $this->actingAs($this->reader)
            ->postJson($this->route($this->cover))
            ->assertOk()
            ->assertJsonPath('official_cover_id', $this->cover->id);
    }

    #[Test]
    public function a_tie_keeps_the_current_official_cover(): void
    {
        $official = NovelCover::factory()->on($this->novel)->liked(1)->create();
        $this->novel->forceFill(['official_cover_id' => $official->id])->save();

        $this->actingAs($this->reader)
            ->postJson($this->route($this->cover))
            ->assertOk()
            ->assertJsonPath('official_cover_id', $official->id);
    }

    #[Test]
    public function notifies_the_illustrator_of_the_like_and_of_the_official_selection(): void
    {
        $this->actingAs($this->reader)->postJson($this->route($this->cover))->assertOk();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->cover->author_id,
            'type' => NotificationType::LikeReceived->value,
        ]);
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->cover->author_id,
            'type' => NotificationType::CoverSelected->value,
        ]);
    }

    #[Test]
    public function refuses_the_illustrator_liking_their_own_cover(): void
    {
        $illustrator = User::factory()->create(['created_at' => now()->subWeek()]);
        $ownCover = NovelCover::factory()->on($this->novel)->by($illustrator)->create();

        $this->actingAs($illustrator)
            ->postJson($this->route($ownCover))
            ->assertForbidden()
            ->assertJsonPath('message', __('likes.denied.own_cover'));
    }

    #[Test]
    public function refuses_a_cover_hidden_by_moderation(): void
    {
        $hidden = NovelCover::factory()->on($this->novel)->hidden()->create();

        $this->actingAs($this->reader)
            ->postJson($this->route($hidden))
            ->assertForbidden()
            ->assertJsonPath('message', __('likes.denied.cover_hidden'));
    }

    #[Test]
    public function refuses_a_banned_reader(): void
    {
        $banned = User::factory()->banned(SanctionType::AccountBan)->create(['created_at' => now()->subWeek()]);

        $this->actingAs($banned)
            ->postJson($this->route($this->cover))
            ->assertForbidden()
            ->assertJsonPath('message', __('likes.denied.banned'));
    }

    #[Test]
    public function refuses_an_account_too_young(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route($this->cover))
            ->assertForbidden()
            ->assertJsonPath('message', __('likes.denied.account_too_young'));
    }
}
