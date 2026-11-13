<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Enums\NotificationType;
use App\Enums\ReportResolution;
use App\Enums\ReportStatus;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Http\Requests\ModerateCoverRequest;
use App\Models\Notification;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerModerateCoverTest extends TestCase
{
    protected array $datas = [
        'resolution' => 'hidden',
        'sanction' => ['type' => 'warning', 'reason' => 'Illustration reprise sans autorisation'],
    ];

    private User $moderator;

    private Novel $novel;

    private NovelCover $cover;

    private Report $report;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
        $this->novel = Novel::factory()->create();
        $this->cover = NovelCover::factory()->on($this->novel)->liked(3)->create();
        $this->novel->forceFill(['official_cover_id' => $this->cover->id])->save();
        $this->report = Report::factory()->on($this->cover)->create();
    }

    private function route(NovelCover $cover): string
    {
        return "/api/v1/moderation/covers/{$cover->id}/decision";
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue(
            $this->hasFormRequest(ModerationController::class, 'moderateCover', ModerateCoverRequest::class)
        );
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@moderateCover');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report', 'can:moderate,cover'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route($this->cover), $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_cover_without_pending_report(): void
    {
        $unreported = NovelCover::factory()->on($this->novel)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($unreported), $this->getDatas())
            ->assertConflict();
    }

    #[Test]
    public function refuses_a_cover_already_hidden(): void
    {
        $hidden = NovelCover::factory()->on($this->novel)->hidden()->create();
        Report::factory()->on($hidden)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($hidden), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function hiding_processes_the_reports_and_hides_the_cover(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertOk();

        $this->assertDatabaseHas('novel_covers', ['id' => $this->cover->id, 'status' => NovelCover::STATUS_HIDDEN]);
        $this->assertDatabaseHas('reports', [
            'id' => $this->report->id,
            'status' => ReportStatus::Processed->value,
            'moderator_id' => $this->moderator->id,
            'resolution' => ReportResolution::Hidden->value,
        ]);
    }

    #[Test]
    public function hiding_the_official_cover_hands_the_title_to_the_most_liked_rival(): void
    {
        $rival = NovelCover::factory()->on($this->novel)->liked(1)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertOk();

        $this->assertDatabaseHas('novels', ['id' => $this->novel->id, 'official_cover_id' => $rival->id]);
    }

    #[Test]
    public function hiding_the_only_cover_leaves_the_novel_without_official_cover(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertOk();

        $this->assertDatabaseHas('novels', ['id' => $this->novel->id, 'official_cover_id' => null]);
    }

    #[Test]
    public function refuses_to_hide_a_cover_without_sanction(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->cover), ['resolution' => ReportResolution::Hidden->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sanction.type' => __('validation.moderation.sanction.type.required_for_hidden_cover')]);

        $this->assertTrue($this->cover->refresh()->isPublished());
    }

    #[Test]
    public function refuses_to_archive_a_cover(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->cover), ['resolution' => ReportResolution::Archived->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['resolution' => __('validation.moderation.resolution.enum')]);
    }

    #[Test]
    public function dismissing_leaves_the_cover_official(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->cover), ['resolution' => ReportResolution::Dismissed->value])
            ->assertOk();

        $this->assertDatabaseHas('novel_covers', ['id' => $this->cover->id, 'status' => NovelCover::STATUS_PUBLISHED]);
        $this->assertDatabaseHas('novels', ['id' => $this->novel->id, 'official_cover_id' => $this->cover->id]);
    }

    #[Test]
    public function records_the_sanction_of_the_illustrator(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->cover), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => SanctionType::WriteBan->value, 'days' => 30, 'reason' => 'Plagiat'],
            ])
            ->assertOk();

        $this->assertDatabaseHas('sanctions', [
            'user_id' => $this->cover->author_id,
            'type' => SanctionType::WriteBan->value,
            'report_id' => $this->report->id,
        ]);
    }

    #[Test]
    public function notifies_the_illustrator_and_the_reporter_with_the_cover(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertOk();

        $authorNotification = Notification::query()
            ->where('notifiable_id', $this->cover->author_id)
            ->where('type', NotificationType::ContentModerated->value)
            ->sole();
        $this->assertSame('novel_cover', $authorNotification->data['content_type']);
        $this->assertSame($this->cover->id, data_get($authorNotification->data, 'cover.id'));
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->report->reporter_id,
            'type' => NotificationType::ReportProcessed->value,
        ]);
    }
}
