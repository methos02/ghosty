<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Enums\NotificationType;
use App\Enums\ReportResolution;
use App\Enums\ReportStatus;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Http\Requests\ModerateChapterRequest;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerModerateChapterTest extends TestCase
{
    private User $moderator;

    private Novel $novel;

    private Chapter $root;

    private Chapter $leaf;

    private Report $firstReport;

    private Report $secondReport;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
        $this->novel = Novel::factory()->create(['chapter_count' => 2]);
        $this->root = Chapter::factory()->create(['novel_id' => $this->novel->id]);
        $this->leaf = Chapter::factory()->continuing($this->root)->liked(1)->create([
            'content' => 'Début du texte. Passage injurieux ici. Fin du texte.',
        ]);
        $this->firstReport = Report::factory()->on($this->leaf)->create(['created_at' => now()->subHour()]);
        $this->secondReport = Report::factory()->on($this->leaf)->create();
    }

    private function route(Chapter $chapter): string
    {
        return "/api/v1/moderation/chapters/{$chapter->id}/decision";
    }

    private function marker(): string
    {
        return Config::string('ghosty.moderation.removed_passage_marker');
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue(
            $this->hasFormRequest(ModerationController::class, 'moderateChapter', ModerateChapterRequest::class)
        );
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@moderateChapter');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report', 'can:moderate,chapter'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Dismissed->value])
            ->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Dismissed->value])
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_chapter_that_is_not_published(): void
    {
        $archived = Chapter::factory()->continuing($this->root)->archived()->create();
        Report::factory()->on($archived)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($archived), ['resolution' => ReportResolution::Dismissed->value])
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_chapter_without_pending_report(): void
    {
        $unreported = Chapter::factory()->continuing($this->root)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($unreported), ['resolution' => ReportResolution::Dismissed->value])
            ->assertConflict();
    }

    #[Test]
    public function resolution_is_required(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['resolution' => __('validation.moderation.resolution.required')]);
    }

    #[Test]
    public function archiving_takes_the_leaf_out_of_reading(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Archived->value])
            ->assertOk();

        $this->assertDatabaseHas('chapters', ['id' => $this->leaf->id, 'status' => Chapter::STATUS_ARCHIVED]);
        $this->assertDatabaseHas('chapters', ['id' => $this->root->id, 'continuations_count' => 0]);
        $this->assertDatabaseHas('novels', ['id' => $this->novel->id, 'chapter_count' => 1]);
    }

    #[Test]
    public function hiding_the_last_chapter_of_the_main_branch_trims_the_main_branch_to_its_parent(): void
    {
        $this->assertDatabaseHas('novels', ['id' => $this->novel->id, 'main_branch_last_chapter_id' => $this->leaf->id]);

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Hidden->value])
            ->assertOk();

        $this->assertDatabaseHas('chapters', ['id' => $this->leaf->id, 'status' => Chapter::STATUS_HIDDEN]);
        $this->assertDatabaseHas('novels', ['id' => $this->novel->id, 'main_branch_last_chapter_id' => $this->root->id]);
    }

    #[Test]
    public function refuses_to_archive_a_chapter_with_a_published_continuation(): void
    {
        Chapter::factory()->continuing($this->leaf)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Archived->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['resolution' => __('validation.moderation.resolution.enum')]);

        $this->assertDatabaseHas('chapters', ['id' => $this->leaf->id, 'status' => Chapter::STATUS_PUBLISHED]);
    }

    #[Test]
    public function refuses_to_hide_the_root_chapter(): void
    {
        Report::factory()->on($this->root)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->root), ['resolution' => ReportResolution::Hidden->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['resolution' => __('validation.moderation.resolution.enum')]);
    }

    #[Test]
    public function removing_a_passage_replaces_it_and_keeps_the_original_text(): void
    {
        $contentAfterRemoval = 'Début du texte. '.$this->marker().' Fin du texte.';

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::PassageRemoved->value,
                'content' => $contentAfterRemoval,
            ])
            ->assertOk();

        $this->leaf->refresh();
        $this->assertSame($contentAfterRemoval, $this->leaf->content);
        $this->assertSame(Chapter::STATUS_PUBLISHED, $this->leaf->status);
        $this->assertNotNull($this->leaf->corrected_at);
        $this->assertDatabaseHas('chapter_versions', [
            'chapter_id' => $this->leaf->id,
            'moderator_id' => $this->moderator->id,
            'content' => 'Début du texte. Passage injurieux ici. Fin du texte.',
        ]);
    }

    #[Test]
    public function removing_a_passage_is_allowed_on_a_chapter_with_a_published_continuation(): void
    {
        Chapter::factory()->continuing($this->leaf)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::PassageRemoved->value,
                'content' => 'Début du texte. '.$this->marker().' Fin du texte.',
            ])
            ->assertOk();
    }

    #[Test]
    public function removing_a_passage_requires_the_text_after_removal(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::PassageRemoved->value])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['content' => __('validation.moderation.content.required')]);
    }

    #[Test]
    public function removing_a_passage_refuses_an_added_or_modified_text(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::PassageRemoved->value,
                'content' => 'Début du texte réécrit. '.$this->marker().' Fin du texte.',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['content' => __('validation.moderation.content.altered')]);

        $this->assertDatabaseCount('chapter_versions', 0);
    }

    #[Test]
    public function removing_a_passage_refuses_a_text_where_nothing_was_removed(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::PassageRemoved->value,
                'content' => 'Début du texte. '.$this->marker().'Passage injurieux ici. Fin du texte.',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['content' => __('validation.moderation.content.nothing_removed')]);
    }

    #[Test]
    public function dismissing_leaves_the_chapter_untouched(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Dismissed->value])
            ->assertOk();

        $this->assertDatabaseHas('chapters', [
            'id' => $this->leaf->id,
            'status' => Chapter::STATUS_PUBLISHED,
            'content' => 'Début du texte. Passage injurieux ici. Fin du texte.',
        ]);
        $this->assertDatabaseHas('chapters', ['id' => $this->root->id, 'continuations_count' => 1]);
    }

    #[Test]
    public function processes_every_pending_report_of_the_chapter(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Archived->value])
            ->assertOk();

        foreach ([$this->firstReport, $this->secondReport] as $report) {
            $this->assertDatabaseHas('reports', [
                'id' => $report->id,
                'status' => ReportStatus::Processed->value,
                'moderator_id' => $this->moderator->id,
                'resolution' => ReportResolution::Archived->value,
            ]);
        }
    }

    #[Test]
    public function records_a_timed_sanction_linked_to_the_first_report(): void
    {
        $this->freezeTime();

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => SanctionType::WriteBan->value, 'days' => 7, 'reason' => 'Propos haineux'],
            ])
            ->assertOk();

        $this->assertDatabaseHas('sanctions', [
            'user_id' => $this->leaf->author_id,
            'moderator_id' => $this->moderator->id,
            'report_id' => $this->firstReport->id,
            'type' => SanctionType::WriteBan->value,
            'until' => now()->addDays(7)->toDateTimeString(),
            'reason' => 'Propos haineux',
        ]);
    }

    #[Test]
    public function a_sanction_without_duration_is_permanent(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => SanctionType::AccountBan->value, 'reason' => 'Harcèlement répété'],
            ])
            ->assertOk();

        $this->assertDatabaseHas('sanctions', [
            'user_id' => $this->leaf->author_id,
            'type' => SanctionType::AccountBan->value,
            'until' => null,
        ]);
    }

    #[Test]
    public function refuses_an_unknown_sanction_type(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => 'exile', 'reason' => 'Propos haineux'],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sanction.type' => __('validation.moderation.sanction.type.enum')]);
    }

    #[Test]
    public function requires_a_reason_with_a_sanction(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => SanctionType::Warning->value],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sanction.reason' => __('validation.moderation.sanction.reason.required')]);

        $this->assertDatabaseCount('sanctions', 0);
    }

    #[Test]
    public function tells_the_author_why_they_are_sanctioned(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => SanctionType::Warning->value, 'reason' => 'Propos haineux'],
            ])
            ->assertOk();

        $this->actingAs($this->leaf->author)
            ->getJson('/api/v1/me/notifications')
            ->assertJsonPath('notifications.0.sanction.reason', 'Propos haineux');
    }

    #[Test]
    public function an_account_ban_revokes_the_author_access_tokens(): void
    {
        $this->leaf->author->createToken('auth-token');

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => SanctionType::AccountBan->value, 'reason' => 'Harcèlement répété'],
            ])
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $this->leaf->author_id]);
    }

    #[Test]
    public function a_write_ban_keeps_the_author_access_tokens(): void
    {
        $this->leaf->author->createToken('auth-token');

        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), [
                'resolution' => ReportResolution::Hidden->value,
                'sanction' => ['type' => SanctionType::WriteBan->value, 'days' => 7, 'reason' => 'Propos haineux'],
            ])
            ->assertOk();

        $this->assertDatabaseHas('personal_access_tokens', ['tokenable_id' => $this->leaf->author_id]);
    }

    #[Test]
    public function notifies_the_author_of_the_decision(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Archived->value])
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->leaf->author_id,
            'type' => NotificationType::ContentModerated->value,
        ]);
    }

    #[Test]
    public function does_not_notify_the_author_of_a_dismissal_without_sanction(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Dismissed->value])
            ->assertOk();

        $this->assertDatabaseMissing('notifications', [
            'notifiable_id' => $this->leaf->author_id,
            'type' => NotificationType::ContentModerated->value,
        ]);
    }

    #[Test]
    public function notifies_every_reporter_that_their_report_was_processed(): void
    {
        $this->actingAs($this->moderator)
            ->postJson($this->route($this->leaf), ['resolution' => ReportResolution::Dismissed->value])
            ->assertOk();

        foreach ([$this->firstReport, $this->secondReport] as $report) {
            $this->assertDatabaseHas('notifications', [
                'notifiable_id' => $report->reporter_id,
                'type' => NotificationType::ReportProcessed->value,
            ]);
        }
    }
}
