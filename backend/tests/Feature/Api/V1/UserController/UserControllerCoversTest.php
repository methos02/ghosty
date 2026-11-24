<?php

namespace Tests\Feature\Api\V1\UserController;

use App\Http\Controllers\Api\V1\UserController;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserControllerCoversTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['username' => 'plume', 'slug' => 'plu123']);
    }

    private function route(string $slug): string
    {
        return "/api/v1/users/{$slug}/covers";
    }

    #[Test]
    public function lists_the_published_covers_of_the_user_most_recent_first(): void
    {
        $older = NovelCover::factory()->by($this->user)->create(['created_at' => now()->subDay()]);
        $newer = NovelCover::factory()->by($this->user)->create();
        NovelCover::factory()->by($this->user)->hidden()->create();
        NovelCover::factory()->create();

        $this->getJson($this->route('plu123'))
            ->assertOk()
            ->assertJsonPath('covers.*.id', [$newer->id, $older->id])
            ->assertJsonPath('covers.0.novel.slug', $newer->novel->slug)
            ->assertJsonPath('meta.total', 2);
    }

    #[Test]
    public function marks_the_official_cover_of_its_novel(): void
    {
        $novel = Novel::factory()->create();
        $official = NovelCover::factory()->on($novel)->by($this->user)->create(['created_at' => now()->subDay()]);
        $novel->forceFill(['official_cover_id' => $official->id])->save();
        $alternative = NovelCover::factory()->by($this->user)->create();

        $this->getJson($this->route('plu123'))
            ->assertOk()
            ->assertJsonPath('covers.*.id', [$alternative->id, $official->id])
            ->assertJsonPath('covers.*.is_official', [false, true]);
    }

    #[Test]
    public function answers_not_found_for_an_unknown_slug(): void
    {
        $this->getJson($this->route('zzz999'))
            ->assertNotFound();
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(UserController::class.'@covers');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'can:view,user'], $route->gatherMiddleware());
    }

    #[Test]
    public function answers_not_found_for_a_deleted_account(): void
    {
        User::factory()->deleted()->create(['slug' => 'del123']);

        $this->getJson($this->route('del123'))
            ->assertNotFound();
    }
}
