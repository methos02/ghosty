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

class ModerationControllerShowChapterTest extends TestCase
{
    private User $moderator;

    private Chapter $root;

    private Chapter $leaf;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
        $this->root = Chapter::factory()->create();
        $this->leaf = Chapter::factory()->continuing($this->root)->create(['title' => 'La chute']);
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@showChapter');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson("/api/v1/moderation/chapters/{$this->leaf->id}")
            ->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson("/api/v1/moderation/chapters/{$this->leaf->id}")
            ->assertForbidden();
    }

    #[Test]
    public function serves_the_chapter_with_its_reports_and_the_author_sanctions(): void
    {
        $reporter = User::factory()->create(['username' => 'lectrice']);
        Report::factory()->on($this->leaf)->create([
            'reporter_id' => $reporter->id,
            'reason' => ReportReason::Plagiarism->value,
            'description' => 'Recopié mot pour mot.',
        ]);
        Sanction::factory()->ofType(SanctionType::Warning)->create([
            'user_id' => $this->leaf->author_id,
            'reason' => 'Premier avertissement',
        ]);

        $this->actingAs($this->moderator)
            ->getJson("/api/v1/moderation/chapters/{$this->leaf->id}")
            ->assertOk()
            ->assertJsonPath('chapter.id', $this->leaf->id)
            ->assertJsonPath('chapter.title', 'La chute')
            ->assertJsonPath('chapter.content', $this->leaf->content)
            ->assertJsonPath('is_removable', true)
            ->assertJsonCount(1, 'reports')
            ->assertJsonPath('reports.0.reason', ReportReason::Plagiarism->value)
            ->assertJsonPath('reports.0.description', 'Recopié mot pour mot.')
            ->assertJsonPath('reports.0.reporter.username', 'lectrice')
            ->assertJsonCount(1, 'author_sanctions')
            ->assertJsonPath('author_sanctions.0.type', SanctionType::Warning->value)
            ->assertJsonPath('author_sanctions.0.reason', 'Premier avertissement');
    }

    #[Test]
    public function a_chapter_with_a_published_continuation_is_not_removable(): void
    {
        Chapter::factory()->continuing($this->leaf)->create();

        $this->actingAs($this->moderator)
            ->getJson("/api/v1/moderation/chapters/{$this->leaf->id}")
            ->assertOk()
            ->assertJsonPath('is_removable', false);
    }

    #[Test]
    public function the_root_chapter_is_not_removable(): void
    {
        $lonelyRoot = Chapter::factory()->create();

        $this->actingAs($this->moderator)
            ->getJson("/api/v1/moderation/chapters/{$lonelyRoot->id}")
            ->assertOk()
            ->assertJsonPath('is_removable', false);
    }
}
