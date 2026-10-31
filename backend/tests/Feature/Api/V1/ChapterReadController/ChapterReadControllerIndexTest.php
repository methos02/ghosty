<?php

namespace Tests\Feature\Api\V1\ChapterReadController;

use App\Http\Controllers\Api\V1\ChapterReadController;
use App\Models\Chapter;
use App\Models\ChapterRead;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterReadControllerIndexTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ChapterReadController::class.'@index');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson('/api/v1/me/reading-history')->assertUnauthorized();
    }

    #[Test]
    public function serves_each_read_chapter_with_its_novel_and_the_reading_date(): void
    {
        $reader = User::factory()->create();
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $chapter = Chapter::factory()->create(['novel_id' => $novel->id, 'title' => 'Le virage']);
        ChapterRead::factory()->by($reader)->on($chapter)->create(['created_at' => '2026-10-01 20:15:00']);

        $this->actingAs($reader)
            ->getJson('/api/v1/me/reading-history')
            ->assertOk()
            ->assertJsonPath('reads.0.chapter.id', $chapter->id)
            ->assertJsonPath('reads.0.chapter.title', 'Le virage')
            ->assertJsonPath('reads.0.chapter.novel.slug', 'nuit-virage')
            ->assertJsonPath('reads.0.read_at', '2026-10-01T20:15:00+00:00');
    }

    #[Test]
    public function lists_only_the_reads_of_the_reader_latest_first(): void
    {
        $reader = User::factory()->create();
        $older = ChapterRead::factory()->by($reader)->create(['created_at' => now()->subDay()]);
        $latest = ChapterRead::factory()->by($reader)->create(['created_at' => now()]);
        ChapterRead::factory()->create();

        $this->actingAs($reader)
            ->getJson('/api/v1/me/reading-history')
            ->assertOk()
            ->assertJsonPath('reads.*.chapter.id', [$latest->chapter_id, $older->chapter_id]);
    }

    #[Test]
    public function paginates_with_the_configured_page_size(): void
    {
        Config::set('ghosty.reading.per_page', 1);
        $reader = User::factory()->create();
        ChapterRead::factory()->count(2)->by($reader)->create();

        $this->actingAs($reader)
            ->getJson('/api/v1/me/reading-history')
            ->assertOk()
            ->assertJsonCount(1, 'reads')
            ->assertJsonPath('meta.total', 2);
    }
}
