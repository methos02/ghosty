<?php

namespace Tests\Feature\Api\V1\MetricsController;

use App\Http\Controllers\Api\V1\MetricsController;
use App\Http\Requests\MetricsFilterRequest;
use App\Models\Chapter;
use App\Models\ChapterRead;
use App\Models\Comment;
use App\Models\Follow;
use App\Models\Like;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MetricsControllerIndexTest extends TestCase
{
    private string $route = '/api/v1/metrics';

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->freezeSecond();
        $this->admin = User::factory()->admin()->create();
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(MetricsController::class, 'index', MetricsFilterRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(MetricsController::class.'@index');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:viewMetrics,App\Models\User'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson($this->route)->assertUnauthorized();
    }

    #[Test]
    public function forbids_a_moderator(): void
    {
        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route)
            ->assertForbidden();
    }

    #[Test]
    public function forbids_a_banned_admin(): void
    {
        $this->actingAs(User::factory()->admin()->banned()->create())
            ->getJson($this->route)
            ->assertForbidden();
    }

    #[Test]
    public function rejects_a_period_that_is_not_a_number_of_days(): void
    {
        $this->actingAs($this->admin)
            ->getJson($this->route.'?days=week')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['days' => __('validation.metrics_filter.days.integer')]);
    }

    #[Test]
    public function rejects_a_period_shorter_than_one_day(): void
    {
        $this->actingAs($this->admin)
            ->getJson($this->route.'?days=0')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['days' => __('validation.metrics_filter.days.min', ['min' => 1])]);
    }

    #[Test]
    public function rejects_a_period_longer_than_the_maximum(): void
    {
        $this->actingAs($this->admin)
            ->getJson($this->route.'?days=366')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['days' => __('validation.metrics_filter.days.max', ['max' => 365])]);
    }

    #[Test]
    public function covers_the_last_thirty_days_by_default(): void
    {
        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('period.days', 30)
            ->assertJsonPath('period.from', now()->subDays(30)->toIso8601String())
            ->assertJsonPath('period.to', now()->toIso8601String())
            ->assertJsonPath('inactive_after_days', 30);
    }

    #[Test]
    public function counts_readers_who_discovered_chapters_on_two_distinct_days(): void
    {
        $chapter = Chapter::factory()->create();
        $otherChapter = Chapter::factory()->continuing($chapter)->create();
        $reader = User::factory()->create();
        ChapterRead::factory()->by($reader)->on($chapter)->create(['created_at' => now()->subDays(3)]);
        ChapterRead::factory()->by($reader)->on($otherChapter)->create(['created_at' => now()->subDay()]);
        ChapterRead::factory()->inSession('same-day')->on($chapter)->create(['created_at' => now()->subHours(2)]);
        ChapterRead::factory()->inSession('same-day')->on($otherChapter)->create(['created_at' => now()->subHour()]);
        ChapterRead::factory()->inSession('before-period')->on($chapter)->create(['created_at' => now()->subDays(40)]);
        ChapterRead::factory()->inSession('before-period')->on($otherChapter)->create(['created_at' => now()->subDay()]);

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.returning_readers', ['count' => 1, 'total' => 3]);
    }

    #[Test]
    public function counts_authors_who_published_again_during_the_period(): void
    {
        $returningAuthor = User::factory()->create();
        Chapter::factory()->create(['author_id' => $returningAuthor->id, 'published_at' => now()->subDays(60)]);
        Chapter::factory()->create(['author_id' => $returningAuthor->id, 'published_at' => now()->subDays(2)]);
        Chapter::factory()->create(['published_at' => now()->subDay()]);
        Chapter::factory()->create(['published_at' => now()->subDays(45)]);

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.returning_authors', ['count' => 1, 'total' => 2]);
    }

    #[Test]
    public function counts_continuations_published_during_the_period_that_were_continued(): void
    {
        $root = Chapter::factory()->create(['published_at' => now()->subDays(5)]);
        $continued = Chapter::factory()->continuing($root)->create(['published_at' => now()->subDays(4)]);
        Chapter::factory()->continuing($continued)->create(['published_at' => now()->subDays(3)]);
        Chapter::factory()->continuing($root)->create(['published_at' => now()->subDays(2)]);
        Chapter::factory()->continuing($root)->create(['published_at' => now()->subDays(50)]);

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.continued_continuations', ['count' => 1, 'total' => 3]);
    }

    #[Test]
    public function counts_branches_extended_during_the_period_among_all_branches(): void
    {
        $extendedBranch = Chapter::factory()->create(['published_at' => now()->subDays(90)]);
        Chapter::factory()->continuing($extendedBranch)->create(['published_at' => now()->subDay()]);
        $dormantBranch = Chapter::factory()->create(['published_at' => now()->subDays(90)]);
        Chapter::factory()->continuing($dormantBranch)->create(['published_at' => now()->subDays(60)]);

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.active_branches', ['count' => 1, 'total' => 2]);
    }

    #[Test]
    public function counts_readers_of_a_chapter_outside_the_main_branch(): void
    {
        $root = Chapter::factory()->create();
        $mainChapter = Chapter::factory()->continuing($root)->liked(3)->create();
        $beyondMainBranch = Chapter::factory()->continuing($mainChapter->refresh())->create();
        $rivalChapter = Chapter::factory()->continuing($root)->create();
        ChapterRead::factory()->inSession('explorer')->on($root)->create();
        ChapterRead::factory()->inSession('explorer')->on($rivalChapter)->create();
        ChapterRead::factory()->inSession('main-reader')->on($mainChapter)->create();
        ChapterRead::factory()->inSession('main-reader')->on($beyondMainBranch)->create();

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.alternate_branch_readers', ['count' => 1, 'total' => 2]);
    }

    #[Test]
    public function counts_each_account_following_a_branch_once(): void
    {
        $follower = User::factory()->create();
        Follow::factory()->by($follower)->create();
        Follow::factory()->by($follower)->create();
        Follow::factory()->create();

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.branch_followers', ['count' => 2, 'total' => null]);
    }

    #[Test]
    public function counts_novel_readings_that_reached_the_end_of_a_branch(): void
    {
        $root = Chapter::factory()->create();
        $lastChapter = Chapter::factory()->continuing($root)->create();
        $otherNovelRoot = Chapter::factory()->create();
        Chapter::factory()->continuing($otherNovelRoot)->create();
        ChapterRead::factory()->inSession('finisher')->on($root)->create();
        ChapterRead::factory()->inSession('finisher')->on($lastChapter)->create();
        ChapterRead::factory()->inSession('finisher')->on($otherNovelRoot)->create();

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.completed_readings', ['count' => 1, 'total' => 2]);
    }

    #[Test]
    public function counts_comments_and_likes_created_during_the_period(): void
    {
        Comment::factory()->create();
        Comment::factory()->create(['created_at' => now()->subDays(31)]);
        Like::factory()->create();
        Like::factory()->create();

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.comments', ['count' => 1, 'total' => null])
            ->assertJsonPath('metrics.likes', ['count' => 2, 'total' => null]);
    }

    #[Test]
    public function counts_old_continuations_without_any_interaction_without_changing_them(): void
    {
        $root = Chapter::factory()->create(['published_at' => now()->subDays(60)]);
        $inactive = Chapter::factory()->continuing($root)->create(['published_at' => now()->subDays(40)]);
        Chapter::factory()->continuing($root)->liked(1)->create(['published_at' => now()->subDays(40)]);
        Chapter::factory()->continuing($root)->create(['published_at' => now()->subDays(40), 'comment_count' => 2]);
        Chapter::factory()->continuing($root)->create(['published_at' => now()->subDays(5)]);

        $this->actingAs($this->admin)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('metrics.inactive_continuations', ['count' => 1, 'total' => 3]);

        $this->assertSame(Chapter::STATUS_PUBLISHED, $inactive->refresh()->status);
    }

    #[Test]
    public function narrows_the_counts_to_the_requested_period(): void
    {
        Comment::factory()->create(['created_at' => now()->subDays(3)]);
        Comment::factory()->create(['created_at' => now()->subDays(10)]);

        $this->actingAs($this->admin)
            ->getJson($this->route.'?days=7')
            ->assertOk()
            ->assertJsonPath('period.days', 7)
            ->assertJsonPath('metrics.comments.count', 1);
    }
}
