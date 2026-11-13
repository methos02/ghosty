<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Enums\ReportReason;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Models\NovelCover;
use App\Models\Report;
use App\Models\Sanction;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerShowCoverTest extends TestCase
{
    private NovelCover $cover;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cover = NovelCover::factory()->create();
    }

    private function route(NovelCover $cover): string
    {
        return "/api/v1/moderation/covers/{$cover->id}";
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@showCover');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson($this->route($this->cover))
            ->assertUnauthorized();
    }

    #[Test]
    public function serves_the_cover_with_its_novel_reports_and_author_sanctions(): void
    {
        $report = Report::factory()->on($this->cover)->create(['reason' => ReportReason::UnauthorizedIllustration->value]);
        $sanction = Sanction::factory()->ofType(SanctionType::Warning)->create(['user_id' => $this->cover->author_id]);

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route($this->cover))
            ->assertOk()
            ->assertJsonPath('cover.id', $this->cover->id)
            ->assertJsonPath('cover.novel.slug', $this->cover->novel->slug)
            ->assertJsonPath('cover.author.username', $this->cover->author->username)
            ->assertJsonPath('reports.*.id', [$report->id])
            ->assertJsonPath('reports.0.reason', ReportReason::UnauthorizedIllustration->value)
            ->assertJsonPath('author_sanctions.*.id', [$sanction->id]);
    }

    #[Test]
    public function serves_a_hidden_cover(): void
    {
        $hidden = NovelCover::factory()->hidden()->create();

        $this->actingAs(User::factory()->moderator()->create())
            ->getJson($this->route($hidden))
            ->assertOk()
            ->assertJsonPath('cover.is_hidden', true);
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson($this->route($this->cover))
            ->assertForbidden();
    }
}
