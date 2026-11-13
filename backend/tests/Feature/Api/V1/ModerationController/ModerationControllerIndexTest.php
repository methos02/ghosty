<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Enums\ReportReason;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Http\Requests\ReportFilterRequest;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerIndexTest extends TestCase
{
    private string $route = '/api/v1/moderation/reports';

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(ModerationController::class, 'index', ReportFilterRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@index');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson($this->route)->assertUnauthorized();
    }

    #[Test]
    public function rejects_an_unknown_status(): void
    {
        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route.'?status=99')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['status' => __('validation.report_filter.status.enum')]);
    }

    #[Test]
    public function rejects_an_unknown_reason(): void
    {
        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route.'?reason=unknown')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['reason' => __('validation.report.reason.enum')]);
    }

    #[Test]
    public function refuses_a_plain_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson($this->route)
            ->assertForbidden();
    }

    #[Test]
    public function refuses_an_author(): void
    {
        $author = User::factory()->create(['roles' => [User::ROLE_READER, User::ROLE_AUTHOR]]);

        $this->actingAs($author)
            ->getJson($this->route)
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_banned_moderator(): void
    {
        $banned = User::factory()->moderator()->banned()->create();

        $this->actingAs($banned)
            ->getJson($this->route)
            ->assertForbidden();
    }

    #[Test]
    public function serves_an_admin(): void
    {
        Report::factory()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonCount(1, 'reported_contents');
    }

    #[Test]
    public function groups_the_reports_by_reported_content(): void
    {
        $chapter = Chapter::factory()->create(['title' => 'La nuit du virage']);
        Report::factory()->on($chapter)->create(['reason' => ReportReason::Plagiarism->value]);
        Report::factory()->on($chapter)->create(['reason' => ReportReason::Spam->value]);
        Report::factory()->on($chapter)->create(['reason' => ReportReason::Spam->value]);

        $response = $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route);

        $response->assertOk()
            ->assertJsonCount(1, 'reported_contents')
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('reported_contents.0.type', 'chapter')
            ->assertJsonPath('reported_contents.0.id', $chapter->id)
            ->assertJsonPath('reported_contents.0.report_count', 3)
            ->assertJsonPath('reported_contents.0.chapter.title', 'La nuit du virage')
            ->assertJsonPath('reported_contents.0.comment', null);
        $this->assertEqualsCanonicalizing(
            [ReportReason::Plagiarism->value, ReportReason::Spam->value],
            $response->json('reported_contents.0.reasons')
        );
        $firstReportedAt = $response->json('reported_contents.0.first_reported_at');
        $this->assertIsString($firstReportedAt);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T/', $firstReportedAt);
    }

    #[Test]
    public function serves_a_reported_comment_with_its_target(): void
    {
        $chapter = Chapter::factory()->create(['title' => 'Le virage']);
        $comment = Comment::factory()->on($chapter)->create(['content' => 'Propos injurieux']);
        Report::factory()->on($comment)->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('reported_contents.0.type', 'comment')
            ->assertJsonPath('reported_contents.0.id', $comment->id)
            ->assertJsonPath('reported_contents.0.chapter', null)
            ->assertJsonPath('reported_contents.0.comment.content', 'Propos injurieux')
            ->assertJsonPath('reported_contents.0.comment.chapter.title', 'Le virage');
    }

    #[Test]
    public function serves_a_reported_cover_with_its_novel(): void
    {
        $novel = Novel::factory()->create(['title' => 'Nuit virage']);
        $cover = NovelCover::factory()->on($novel)->create();
        Report::factory()->on($cover)->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('reported_contents.0.type', 'novel_cover')
            ->assertJsonPath('reported_contents.0.id', $cover->id)
            ->assertJsonPath('reported_contents.0.chapter', null)
            ->assertJsonPath('reported_contents.0.comment', null)
            ->assertJsonPath('reported_contents.0.cover.id', $cover->id)
            ->assertJsonPath('reported_contents.0.cover.novel.title', 'Nuit virage');
    }

    #[Test]
    public function serves_pending_reports_by_default(): void
    {
        $pending = Report::factory()->create();
        Report::factory()->processed()->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('reported_contents.*.id', [$pending->reportable_id]);
    }

    #[Test]
    public function narrows_down_to_the_requested_status(): void
    {
        Report::factory()->create();
        $processed = Report::factory()->processed()->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route.'?status=2')
            ->assertOk()
            ->assertJsonPath('reported_contents.*.id', [$processed->reportable_id]);
    }

    #[Test]
    public function narrows_down_to_the_requested_reason(): void
    {
        Report::factory()->create(['reason' => ReportReason::Spam->value]);
        $harassment = Report::factory()->create(['reason' => ReportReason::Harassment->value]);

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route.'?reason='.ReportReason::Harassment->value)
            ->assertOk()
            ->assertJsonPath('reported_contents.*.id', [$harassment->reportable_id]);
    }

    #[Test]
    public function serves_the_oldest_reported_content_first(): void
    {
        $older = Report::factory()->create(['created_at' => now()->subDay()]);
        $newer = Report::factory()->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('reported_contents.*.id', [$older->reportable_id, $newer->reportable_id]);
    }
}
