<?php

namespace Tests\Feature\Api\V1\ReadingProgressController;

use App\Http\Controllers\Api\V1\ReadingProgressController;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\ReadingProgress;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ReadingProgressControllerIndexTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ReadingProgressController::class.'@index');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson('/api/v1/me/reading-progress')->assertUnauthorized();
    }

    #[Test]
    public function serves_the_chapter_to_resume_with_its_novel(): void
    {
        $reader = User::factory()->create();
        $novel = Novel::factory()->create(['slug' => 'nuit-virage', 'title' => 'Nuit virage']);
        $chapter = Chapter::factory()->create(['novel_id' => $novel->id, 'title' => 'Le virage']);
        ReadingProgress::factory()->by($reader)->at($chapter)->create(['read_at' => '2026-10-01 20:15:00']);

        $this->actingAs($reader)
            ->getJson('/api/v1/me/reading-progress')
            ->assertOk()
            ->assertJsonPath('progresses.0.chapter.id', $chapter->id)
            ->assertJsonPath('progresses.0.chapter.title', 'Le virage')
            ->assertJsonPath('progresses.0.chapter.novel.title', 'Nuit virage')
            ->assertJsonPath('progresses.0.read_at', '2026-10-01T20:15:00+00:00');
    }

    #[Test]
    public function lists_only_the_novels_of_the_reader_latest_read_first(): void
    {
        $reader = User::factory()->create();
        $older = ReadingProgress::factory()->by($reader)->at(Chapter::factory()->create())->create(['read_at' => now()->subDay()]);
        $latest = ReadingProgress::factory()->by($reader)->at(Chapter::factory()->create())->create(['read_at' => now()]);
        ReadingProgress::factory()->at(Chapter::factory()->create())->create();

        $this->actingAs($reader)
            ->getJson('/api/v1/me/reading-progress')
            ->assertOk()
            ->assertJsonPath('progresses.*.chapter.id', [$latest->chapter_id, $older->chapter_id]);
    }
}
