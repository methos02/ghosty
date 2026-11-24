<?php

namespace Tests\Feature\Api\V1\ReportController;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Requests\StoreUserReportRequest;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ReportControllerStoreForUserTest extends TestCase
{
    private User $reporter;

    private User $reportedUser;

    protected array $datas = ['reason' => ReportReason::Harassment->value, 'description' => 'Messages insistants sous chacun de mes chapitres'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->reporter = User::factory()->create();
        $this->reportedUser = User::factory()->create(['username' => 'importun', 'slug' => 'imp123']);
    }

    private function route(string $slug): string
    {
        return "/api/v1/users/{$slug}/report";
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue(
            $this->hasFormRequest(ReportController::class, 'storeForUser', StoreUserReportRequest::class)
        );
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ReportController::class.'@storeForUser');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'can:view,user'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route('imp123'), $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function records_the_report_on_the_user(): void
    {
        $this->actingAs($this->reporter)
            ->postJson($this->route('imp123'), $this->getDatas())
            ->assertCreated();

        $this->assertDatabaseHas('reports', [
            'reporter_id' => $this->reporter->id,
            'reportable_type' => 'user',
            'reportable_id' => $this->reportedUser->id,
            'reason' => ReportReason::Harassment->value,
            'status' => ReportStatus::Pending->value,
        ]);
    }

    #[Test]
    public function refuses_a_reason_that_targets_a_content(): void
    {
        $this->actingAs($this->reporter)
            ->postJson($this->route('imp123'), $this->getDatas(['reason' => ReportReason::PoorQuality->value]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['reason' => __('validation.report.reason.enum')]);
    }

    #[Test]
    public function refuses_a_second_report_on_the_same_user(): void
    {
        Report::factory()->on($this->reportedUser)->create(['reporter_id' => $this->reporter->id]);

        $this->actingAs($this->reporter)
            ->postJson($this->route('imp123'), $this->getDatas())
            ->assertConflict();
    }

    #[Test]
    public function refuses_a_user_reporting_themselves(): void
    {
        $this->actingAs($this->reportedUser)
            ->postJson($this->route('imp123'), $this->getDatas())
            ->assertForbidden()
            ->assertJsonPath('message', __('reports.denied.self'));
    }

    #[Test]
    public function refuses_a_banned_reporter(): void
    {
        $this->actingAs(User::factory()->banned(SanctionType::AccountBan)->create())
            ->postJson($this->route('imp123'), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function answers_not_found_for_an_unknown_slug(): void
    {
        $this->actingAs($this->reporter)
            ->postJson($this->route('zzz999'), $this->getDatas())
            ->assertNotFound();
    }

    #[Test]
    public function answers_not_found_for_a_deleted_account(): void
    {
        User::factory()->deleted()->create(['slug' => 'del123']);

        $this->actingAs($this->reporter)
            ->postJson($this->route('del123'), $this->getDatas())
            ->assertNotFound();

        $this->assertDatabaseCount('reports', 0);
    }
}
