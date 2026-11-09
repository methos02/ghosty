<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Enums\NotificationType;
use App\Enums\ReportResolution;
use App\Enums\ReportStatus;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Http\Requests\ModerateCommentRequest;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerModerateCommentTest extends TestCase
{
    protected array $datas = [
        'resolution' => 'hidden',
        'sanction' => ['type' => 'warning', 'reason' => 'Insultes envers un autre lecteur'],
    ];

    private User $moderator;

    private Chapter $chapter;

    private Comment $comment;

    private Report $report;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
        $this->chapter = Chapter::factory()->create();
        $this->comment = Comment::factory()->on($this->chapter)->create();
        $this->report = Report::factory()->on($this->comment)->create();
    }

    private function route(Comment $comment): string
    {
        return "/api/v1/moderation/comments/{$comment->id}/decision";
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue(
            $this->hasFormRequest(ModerationController::class, 'moderateComment', ModerateCommentRequest::class)
        );
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@moderateComment');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report', 'can:moderate,comment'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route($this->comment), $this->getDatas())
            ->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route($this->comment), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_comment_without_pending_report(): void
    {
        $unreported = Comment::factory()->on($this->chapter)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($unreported), $this->getDatas())
            ->assertConflict();
    }

    #[Test]
    public function hiding_takes_the_comment_out_of_the_count(): void
    {
        $this->assertDatabaseHas('chapters', ['id' => $this->chapter->id, 'comment_count' => 1]);

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->comment), $this->getDatas())
            ->assertOk();

        $this->assertDatabaseHas('comments', ['id' => $this->comment->id, 'status' => Comment::STATUS_HIDDEN]);
        $this->assertDatabaseHas('chapters', ['id' => $this->chapter->id, 'comment_count' => 0]);
        $this->assertDatabaseHas('reports', [
            'id' => $this->report->id,
            'status' => ReportStatus::Processed->value,
            'moderator_id' => $this->moderator->id,
            'resolution' => ReportResolution::Hidden->value,
        ]);
    }

    #[Test]
    public function hiding_a_reply_decrements_the_reply_count_of_its_parent(): void
    {
        $reply = Comment::factory()->replyingTo($this->comment)->create();
        Report::factory()->on($reply)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($reply), $this->getDatas())
            ->assertOk();

        $this->assertDatabaseHas('comments', ['id' => $this->comment->id, 'reply_count' => 0]);
    }

    #[Test]
    public function refuses_to_hide_a_comment_without_sanction(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->comment), ['resolution' => ReportResolution::Hidden->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sanction.type' => __('validation.moderation.sanction.type.required_for_hidden_comment')]);

        $this->assertTrue($this->comment->refresh()->isVisible());
    }

    #[Test]
    public function refuses_to_archive_a_comment(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->comment), ['resolution' => ReportResolution::Archived->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['resolution' => __('validation.moderation.resolution.enum')]);
    }

    #[Test]
    public function refuses_to_remove_a_passage_from_a_comment(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->comment), ['resolution' => ReportResolution::PassageRemoved->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['resolution' => __('validation.moderation.resolution.enum')]);
    }

    #[Test]
    public function dismissing_leaves_the_comment_visible(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->comment), ['resolution' => ReportResolution::Dismissed->value])
            ->assertOk();

        $this->assertDatabaseHas('comments', ['id' => $this->comment->id, 'status' => Comment::STATUS_VISIBLE]);
        $this->assertDatabaseHas('chapters', ['id' => $this->chapter->id, 'comment_count' => 1]);
    }

    #[Test]
    public function records_the_sanction_of_the_comment_author(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->comment), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => SanctionType::CommentBan->value, 'days' => 30, 'reason' => 'Insultes'],
            ])
            ->assertOk();

        $this->assertDatabaseHas('sanctions', [
            'user_id' => $this->comment->author_id,
            'type' => SanctionType::CommentBan->value,
            'report_id' => $this->report->id,
        ]);
    }

    #[Test]
    public function notifies_the_author_and_the_reporter(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->comment), $this->getDatas())
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->comment->author_id,
            'type' => NotificationType::ContentModerated->value,
        ]);
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->report->reporter_id,
            'type' => NotificationType::ReportProcessed->value,
        ]);
    }
}
