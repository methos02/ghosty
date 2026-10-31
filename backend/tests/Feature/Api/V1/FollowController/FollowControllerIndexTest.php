<?php

namespace Tests\Feature\Api\V1\FollowController;

use App\Http\Controllers\Api\V1\FollowController;
use App\Models\Chapter;
use App\Models\Follow;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FollowControllerIndexTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(FollowController::class.'@index');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson('/api/v1/me/follows')->assertUnauthorized();
    }

    #[Test]
    public function serves_the_followed_chapter_with_its_novel_and_author(): void
    {
        $reader = User::factory()->create();
        $novel = Novel::factory()->create(['slug' => 'nuit-virage', 'title' => 'Nuit virage']);
        $chapter = Chapter::factory()->create([
            'novel_id' => $novel->id,
            'title' => 'Le virage',
            'author_id' => User::factory()->create(['username' => 'plume'])->id,
        ]);
        Follow::factory()->by($reader)->on($chapter)->create();

        $this->actingAs($reader)
            ->getJson('/api/v1/me/follows')
            ->assertOk()
            ->assertJsonPath('follows.0.chapter.id', $chapter->id)
            ->assertJsonPath('follows.0.chapter.title', 'Le virage')
            ->assertJsonPath('follows.0.chapter.author.username', 'plume')
            ->assertJsonPath('follows.0.chapter.novel.slug', 'nuit-virage')
            ->assertJsonMissingPath('follows.0.chapter.content');
    }

    #[Test]
    public function lists_only_the_follows_of_the_reader_latest_first(): void
    {
        $reader = User::factory()->create();
        $older = Follow::factory()->by($reader)->create(['created_at' => now()->subDay()]);
        $latest = Follow::factory()->by($reader)->create(['created_at' => now()]);
        Follow::factory()->create();

        $this->actingAs($reader)
            ->getJson('/api/v1/me/follows')
            ->assertOk()
            ->assertJsonPath('follows.*.chapter.id', [$latest->chapter_id, $older->chapter_id]);
    }

    #[Test]
    public function paginates_with_the_configured_page_size(): void
    {
        Config::set('ghosty.reading.per_page', 1);
        $reader = User::factory()->create();
        Follow::factory()->count(2)->by($reader)->create();

        $this->actingAs($reader)
            ->getJson('/api/v1/me/follows')
            ->assertOk()
            ->assertJsonCount(1, 'follows')
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.last_page', 2);
    }
}
