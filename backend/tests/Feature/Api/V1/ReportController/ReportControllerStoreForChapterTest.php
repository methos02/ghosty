<?php

namespace Tests\Feature\Api\V1\ReportController;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Requests\StoreReportRequest;
use App\Models\Chapter;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ReportControllerStoreForChapterTest extends TestCase
{
    private User $reporter;

    private Chapter $chapter;

    protected function setUp(): void
    {
        parent::setUp();

        $this->reporter = User::factory()->create();
        $this->chapter = Chapter::factory()->create();
        $this->datas = ['reason' => ReportReason::HateSpeech->value, 'description' => 'Propos racistes explicites'];
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue(
            $this->hasFormRequest(ReportController::class, 'storeForChapter', StoreReportRequest::class)
        );
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ReportController::class.'@storeForChapter');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson("/api/v1/chapters/{$this->chapter->id}/report", $this->getDatas())
            ->assertUnauthorized();
    }

    #[Test]
    public function records_the_report_with_its_reason(): void
    {
        $this->actingAs($this->reporter)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/report", $this->getDatas())
            ->assertCreated();

        $this->assertDatabaseHas('reports', [
            'reporter_id' => $this->reporter->id,
            'reportable_type' => 'chapter',
            'reportable_id' => $this->chapter->id,
            'reason' => ReportReason::HateSpeech->value,
            'status' => ReportStatus::Pending->value,
        ]);
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    #[Test]
    public function reporting_leaves_the_chapter_visible_and_its_counts_untouched(): void
    {
        $this->actingAs($this->reporter)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/report", $this->getDatas())
            ->assertCreated();

        $this->assertDatabaseHas('chapters', [
            'id' => $this->chapter->id,
            'status' => Chapter::STATUS_PUBLISHED,
            'like_count' => 0,
        ]);
    }

    #[Test]
    public function refuses_an_unknown_reason(): void
    {
        $this->actingAs($this->reporter)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/report", $this->getDatas(['reason' => 'boring']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('reason');
    }

    #[Test]
    public function refuses_a_second_report_on_the_same_chapter(): void
    {
        Report::factory()->on($this->chapter)->create(['reporter_id' => $this->reporter->id]);

        $this->actingAs($this->reporter)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/report", $this->getDatas())
            ->assertConflict();

        $this->assertDatabaseCount('reports', 1);
    }

    #[Test]
    public function refuses_the_author_reporting_their_own_chapter(): void
    {
        $own = Chapter::factory()->create(['author_id' => $this->reporter->id]);

        $this->actingAs($this->reporter)
            ->postJson("/api/v1/chapters/{$own->id}/report", $this->getDatas())
            ->assertForbidden();

        $this->assertDatabaseCount('reports', 0);
    }

    #[Test]
    public function refuses_a_banned_reporter(): void
    {
        $banned = User::factory()->banned()->create();

        $this->actingAs($banned)
            ->postJson("/api/v1/chapters/{$this->chapter->id}/report", $this->getDatas())
            ->assertForbidden();
    }
}
