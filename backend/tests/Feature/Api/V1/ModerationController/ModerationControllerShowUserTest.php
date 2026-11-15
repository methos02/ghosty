<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Enums\ReportReason;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Models\Chapter;
use App\Models\Report;
use App\Models\Sanction;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerShowUserTest extends TestCase
{
    private User $reportedUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->reportedUser = User::factory()->create();
    }

    private function route(User $user): string
    {
        return "/api/v1/moderation/users/{$user->id}";
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@showUser');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson($this->route($this->reportedUser))
            ->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson($this->route($this->reportedUser))
            ->assertForbidden();
    }

    #[Test]
    public function serves_the_profile_with_its_reports_and_sanctions(): void
    {
        Chapter::factory()->create(['author_id' => $this->reportedUser->id]);
        $report = Report::factory()->on($this->reportedUser)->create(['reason' => ReportReason::Harassment->value]);
        $sanction = Sanction::factory()->ofType(SanctionType::Warning)->create(['user_id' => $this->reportedUser->id]);

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route($this->reportedUser))
            ->assertOk()
            ->assertJsonPath('user.username', $this->reportedUser->username)
            ->assertJsonPath('user.statistics.chapter_count', 1)
            ->assertJsonPath('reports.*.id', [$report->id])
            ->assertJsonPath('reports.0.reason', ReportReason::Harassment->value)
            ->assertJsonPath('author_sanctions.*.id', [$sanction->id]);
    }
}
