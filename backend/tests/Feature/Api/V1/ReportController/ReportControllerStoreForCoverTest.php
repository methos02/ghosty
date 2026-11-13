<?php

namespace Tests\Feature\Api\V1\ReportController;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Requests\StoreReportRequest;
use App\Models\NovelCover;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ReportControllerStoreForCoverTest extends TestCase
{
    private User $reporter;

    private NovelCover $cover;

    protected array $datas = ['reason' => ReportReason::UnauthorizedIllustration->value, 'description' => 'Illustration reprise d\'un artiste connu'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->reporter = User::factory()->create();
        $this->cover = NovelCover::factory()->create();
    }

    private function route(NovelCover $cover): string
    {
        return "/api/v1/covers/{$cover->id}/report";
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue(
            $this->hasFormRequest(ReportController::class, 'storeForCover', StoreReportRequest::class)
        );
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ReportController::class.'@storeForCover');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'can:view,cover'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route($this->cover), $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function records_the_report_on_the_cover(): void
    {
        $this->actingAs($this->reporter)
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertCreated();

        $this->assertDatabaseHas('reports', [
            'reporter_id' => $this->reporter->id,
            'reportable_type' => 'novel_cover',
            'reportable_id' => $this->cover->id,
            'reason' => ReportReason::UnauthorizedIllustration->value,
            'status' => ReportStatus::Pending->value,
        ]);
    }

    #[Test]
    public function refuses_a_second_report_on_the_same_cover(): void
    {
        Report::factory()->on($this->cover)->create(['reporter_id' => $this->reporter->id]);

        $this->actingAs($this->reporter)
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertConflict();
    }

    #[Test]
    public function refuses_the_illustrator_reporting_their_own_cover(): void
    {
        $this->actingAs($this->cover->author)
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertForbidden()
            ->assertJsonPath('message', __('reports.denied.own_content'));
    }

    #[Test]
    public function refuses_a_banned_reporter(): void
    {
        $this->actingAs(User::factory()->banned(SanctionType::AccountBan)->create())
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function answers_not_found_for_a_cover_hidden_by_moderation(): void
    {
        $hidden = NovelCover::factory()->hidden()->create();

        $this->actingAs($this->reporter)
            ->postJson($this->route($hidden), $this->getDatas())
            ->assertNotFound();
    }
}
