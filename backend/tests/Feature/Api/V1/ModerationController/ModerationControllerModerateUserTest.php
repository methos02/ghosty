<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Enums\NotificationType;
use App\Enums\ReportResolution;
use App\Enums\ReportStatus;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Http\Requests\ModerateUserRequest;
use App\Models\Notification;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerModerateUserTest extends TestCase
{
    protected array $datas = [
        'resolution' => 'sanctioned',
        'sanction' => ['type' => 'warning', 'reason' => 'Harcèlement dans les commentaires'],
    ];

    private User $moderator;

    private User $reportedUser;

    private Report $report;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
        $this->reportedUser = User::factory()->create(['username' => 'importun']);
        $this->report = Report::factory()->on($this->reportedUser)->create();
    }

    private function route(User $user): string
    {
        return "/api/v1/moderation/users/{$user->id}/decision";
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue(
            $this->hasFormRequest(ModerationController::class, 'moderateUser', ModerateUserRequest::class)
        );
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@moderateUser');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report', 'can:moderate,user'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route($this->reportedUser), $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route($this->reportedUser), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_moderator_deciding_on_their_own_account(): void
    {
        Report::factory()->on($this->moderator)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->moderator), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_user_without_pending_report(): void
    {
        $unreported = User::factory()->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($unreported), $this->getDatas())
            ->assertConflict();
    }

    #[Test]
    public function sanctioning_processes_the_reports_and_records_the_sanction(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->reportedUser), [
                'resolution' => ReportResolution::Sanctioned->value,
                'sanction' => ['type' => SanctionType::CommentBan->value, 'days' => 7, 'reason' => 'Harcèlement'],
            ])
            ->assertOk();

        $this->assertDatabaseHas('reports', [
            'id' => $this->report->id,
            'status' => ReportStatus::Processed->value,
            'moderator_id' => $this->moderator->id,
            'resolution' => ReportResolution::Sanctioned->value,
        ]);
        $this->assertDatabaseHas('sanctions', [
            'user_id' => $this->reportedUser->id,
            'type' => SanctionType::CommentBan->value,
            'report_id' => $this->report->id,
        ]);
    }

    #[Test]
    public function refuses_to_sanction_without_a_sanction(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->reportedUser), ['resolution' => ReportResolution::Sanctioned->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sanction.type' => __('validation.moderation.sanction.type.required_for_sanctioned_user')]);
    }

    #[Test]
    public function refuses_a_sanction_with_a_dismissal(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->reportedUser), [...$this->getDatas(), 'resolution' => ReportResolution::Dismissed->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sanction' => __('validation.moderation.sanction.prohibited_for_dismissed_user')]);
    }

    #[Test]
    public function refuses_a_resolution_that_targets_a_content(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->reportedUser), [...$this->getDatas(), 'resolution' => ReportResolution::Hidden->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['resolution' => __('validation.moderation.resolution.enum')]);
    }

    #[Test]
    public function dismissing_closes_the_reports_without_notifying_the_user(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->reportedUser), ['resolution' => ReportResolution::Dismissed->value])
            ->assertOk();

        $this->assertDatabaseHas('reports', [
            'id' => $this->report->id,
            'status' => ReportStatus::Processed->value,
            'resolution' => ReportResolution::Dismissed->value,
        ]);
        $this->assertDatabaseMissing('notifications', [
            'notifiable_id' => $this->reportedUser->id,
            'type' => NotificationType::ContentModerated->value,
        ]);
    }

    #[Test]
    public function notifies_the_user_and_the_reporter_with_the_username(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->reportedUser), $this->getDatas())
            ->assertOk();

        $userNotification = Notification::query()
            ->where('notifiable_id', $this->reportedUser->id)
            ->where('type', NotificationType::ContentModerated->value)
            ->sole();
        $this->assertSame('user', $userNotification->data['content_type']);
        $this->assertSame('importun', data_get($userNotification->data, 'user.username'));
        $this->assertSame(SanctionType::Warning->value, data_get($userNotification->data, 'sanction.type'));

        $reporterNotification = Notification::query()
            ->where('notifiable_id', $this->report->reporter_id)
            ->where('type', NotificationType::ReportProcessed->value)
            ->sole();
        $this->assertSame('importun', data_get($reporterNotification->data, 'user.username'));
    }
}
