<?php

namespace Tests\Feature\Api\V1\ReportController;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Http\Controllers\Api\V1\ReportController;
use App\Models\Chapter;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ReportControllerIndexTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ReportController::class.'@index');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson('/api/v1/reports')->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_plain_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson('/api/v1/reports')
            ->assertForbidden();
    }

    #[Test]
    public function refuses_an_author(): void
    {
        $author = User::factory()->create(['roles' => [User::ROLE_READER, User::ROLE_AUTHOR]]);

        $this->actingAs($author)->getJson('/api/v1/reports')->assertForbidden();
    }

    #[Test]
    public function refuses_a_banned_moderator(): void
    {
        $banned = User::factory()->moderator()->banned()->create();

        $this->actingAs($banned)->getJson('/api/v1/reports')->assertForbidden();
    }

    #[Test]
    public function serves_a_moderator(): void
    {
        Report::factory()->count(3)->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson('/api/v1/reports')
            ->assertOk()
            ->assertJsonCount(3, 'reports')
            ->assertJsonPath('meta.total', 3);
    }

    #[Test]
    public function serves_an_admin(): void
    {
        Report::factory()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->getJson('/api/v1/reports')
            ->assertOk()
            ->assertJsonCount(1, 'reports');
    }

    #[Test]
    public function shows_who_reported_what_and_why(): void
    {
        $reporter = User::factory()->create(['username' => 'lectrice']);
        $chapter = Chapter::factory()->create(['title' => 'La nuit du virage']);
        Report::factory()->on($chapter)->create([
            'reporter_id' => $reporter->id,
            'reason' => ReportReason::Plagiarism->value,
            'description' => 'Recopié mot pour mot.',
        ]);

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson('/api/v1/reports')
            ->assertOk()
            ->assertJsonPath('reports.0.reason', ReportReason::Plagiarism->value)
            ->assertJsonPath('reports.0.description', 'Recopié mot pour mot.')
            ->assertJsonPath('reports.0.status', ReportStatus::Pending->value)
            ->assertJsonPath('reports.0.reporter.username', 'lectrice')
            ->assertJsonPath('reports.0.reported.type', 'chapter')
            ->assertJsonPath('reports.0.reported.id', $chapter->id)
            ->assertJsonPath('reports.0.reported.title', 'La nuit du virage');
    }

    #[Test]
    public function serves_every_report_whatever_its_status(): void
    {
        Report::factory()->create();
        Report::factory()->processed()->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson('/api/v1/reports')
            ->assertOk()
            ->assertJsonCount(2, 'reports');
    }

    #[Test]
    public function narrows_down_to_the_requested_status(): void
    {
        Report::factory()->create();
        Report::factory()->processed()->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson('/api/v1/reports?status='.ReportStatus::Pending->value)
            ->assertOk()
            ->assertJsonCount(1, 'reports')
            ->assertJsonPath('reports.0.status', ReportStatus::Pending->value);
    }

    #[Test]
    public function narrows_down_to_the_requested_reason(): void
    {
        Report::factory()->create(['reason' => ReportReason::Spam->value]);
        Report::factory()->create(['reason' => ReportReason::Harassment->value]);

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson('/api/v1/reports?reason='.ReportReason::Harassment->value)
            ->assertOk()
            ->assertJsonCount(1, 'reports')
            ->assertJsonPath('reports.0.reason', ReportReason::Harassment->value);
    }

    #[Test]
    public function puts_pending_reports_before_the_processed_ones(): void
    {
        $processed = Report::factory()->processed()->create();
        $pending = Report::factory()->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson('/api/v1/reports')
            ->assertOk()
            ->assertJsonPath('reports.*.id', [$pending->id, $processed->id]);
    }
}
