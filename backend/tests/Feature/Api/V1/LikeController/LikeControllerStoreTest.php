<?php

namespace Tests\Feature\Api\V1\LikeController;

use App\Http\Controllers\Api\V1\LikeController;
use App\Models\Chapter;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LikeControllerStoreTest extends TestCase
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
        $route = Route::getRoutes()->getByAction(LikeController::class.'@store');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:like'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson("/api/v1/chapters/{$this->chapter->id}/like")->assertUnauthorized();
    }

    #[Test]
    public function records_the_support_and_returns_the_fresh_count(): void
    {
        $this->actingAs($this->reader)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/like")
            ->assertOk()
            ->assertJsonPath('is_liked', true)
            ->assertJsonPath('like_count', 1)
            ->assertJsonMissingPath('branch_like_count');

        $this->assertDatabaseHas('likes', [
            'user_id' => $this->reader->id,
            'likeable_type' => 'chapter',
            'likeable_id' => $this->chapter->id,
        ]);
    }

    #[Test]
    public function keeps_the_ip_that_carried_the_support(): void
    {
        $this->actingAs($this->reader)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/like", [], ['REMOTE_ADDR' => '203.0.113.7'])
            ->assertOk();

        $this->assertDatabaseHas('likes', [
            'likeable_id' => $this->chapter->id,
            'created_ip' => '203.0.113.7',
        ]);
    }

    #[Test]
    public function a_second_support_from_the_same_reader_counts_once(): void
    {
        $this->actingAs($this->reader)->postJson("/api/v1/chapters/{$this->chapter->id}/like")->assertOk();

        $this->actingAs($this->reader)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/like")
            ->assertOk()
            ->assertJsonPath('like_count', 1);

        $this->assertDatabaseCount('likes', 1);
    }

    #[Test]
    public function refuses_the_author_supporting_their_own_chapter(): void
    {
        $author = User::factory()->create(['created_at' => now()->subWeek()]);
        $own = Chapter::factory()->create(['author_id' => $author->id]);

        $this->actingAs($author)
            ->postJson("/api/v1/chapters/{$own->id}/like")
            ->assertForbidden();

        $this->assertDatabaseCount('likes', 0);
    }

    #[Test]
    public function refuses_a_reader_whose_email_is_not_verified(): void
    {
        $unverified = User::factory()->unverified()->create(['created_at' => now()->subWeek()]);

        $this->actingAs($unverified)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/like")
            ->assertForbidden();
    }

    #[Test]
    public function refuses_an_account_younger_than_the_configured_age(): void
    {
        Config::set('ghosty.likes.min_account_age_hours', 24);
        $newcomer = User::factory()->create(['created_at' => now()->subHour()]);

        $this->actingAs($newcomer)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/like")
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_banned_reader(): void
    {
        $banned = User::factory()->banned()->create(['created_at' => now()->subWeek()]);

        $this->actingAs($banned)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/like")
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_chapter_that_is_not_published(): void
    {
        $draft = Chapter::factory()->draft()->create();

        $this->actingAs($this->reader)
            ->postJson("/api/v1/chapters/{$draft->id}/like")
            ->assertForbidden();
    }

    #[Test]
    public function the_branch_total_settles_on_the_scheduled_pass_not_on_the_request(): void
    {
        $continuation = Chapter::factory()->continuing($this->chapter)->create();

        $this->actingAs($this->reader)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/like")
            ->assertOk();

        $this->assertSame(0, $continuation->refresh()->branch_like_count);

        $this->assertSame(Command::SUCCESS, Artisan::call('ghosty:recompute-branch-likes'));

        $this->assertSame(1, $continuation->refresh()->branch_like_count);
    }
}
