<?php

namespace Tests\Feature\Api\V1\ReportController;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Requests\StoreReportRequest;
use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ReportControllerStoreForCommentTest extends TestCase
{
    private User $reporter;

    private Comment $comment;

    protected array $datas = ['reason' => ReportReason::Insult->value, 'description' => 'Insulte envers un autre lecteur'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->reporter = User::factory()->create();
        $this->comment = Comment::factory()->create();
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue(
            $this->hasFormRequest(ReportController::class, 'storeForComment', StoreReportRequest::class)
        );
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ReportController::class.'@storeForComment');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson("/api/v1/comments/{$this->comment->id}/report", $this->getDatas())
            ->assertUnauthorized();
    }

    #[Test]
    public function records_the_report_on_the_comment(): void
    {
        $this->actingAs($this->reporter)
            ->postJson("/api/v1/comments/{$this->comment->id}/report", $this->getDatas())
            ->assertCreated();

        $this->assertDatabaseHas('reports', [
            'reporter_id' => $this->reporter->id,
            'reportable_type' => 'comment',
            'reportable_id' => $this->comment->id,
            'reason' => ReportReason::Insult->value,
            'status' => ReportStatus::Pending->value,
        ]);
    }

    #[Test]
    public function refuses_a_second_report_on_the_same_comment(): void
    {
        Report::factory()->on($this->comment)->create(['reporter_id' => $this->reporter->id]);

        $this->actingAs($this->reporter)
            ->postJson("/api/v1/comments/{$this->comment->id}/report", $this->getDatas())
            ->assertConflict();

        $this->assertDatabaseCount('reports', 1);
    }

    #[Test]
    public function refuses_the_author_reporting_their_own_comment(): void
    {
        $this->actingAs($this->comment->author)
            ->postJson("/api/v1/comments/{$this->comment->id}/report", $this->getDatas())
            ->assertForbidden()
            ->assertJsonPath('message', __('reports.denied.own_content'));

        $this->assertDatabaseCount('reports', 0);
    }

    #[Test]
    public function refuses_a_banned_reporter(): void
    {
        $this->actingAs(User::factory()->banned()->create())
            ->postJson("/api/v1/comments/{$this->comment->id}/report", $this->getDatas())
            ->assertForbidden();

        $this->assertDatabaseCount('reports', 0);
    }

    #[Test]
    public function does_not_find_a_deleted_comment(): void
    {
        $deleted = Comment::factory()->deleted()->create();

        $this->actingAs($this->reporter)
            ->postJson("/api/v1/comments/{$deleted->id}/report", $this->getDatas())
            ->assertNotFound();
    }

    #[Test]
    public function does_not_find_a_hidden_comment(): void
    {
        $hidden = Comment::factory()->hidden()->create();

        $this->actingAs($this->reporter)
            ->postJson("/api/v1/comments/{$hidden->id}/report", $this->getDatas())
            ->assertNotFound();
    }
}
