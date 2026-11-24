<?php

namespace Tests\Feature\Api\V1\UserController;

use App\Http\Controllers\Api\V1\UserController;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserControllerNovelsTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['username' => 'plume', 'slug' => 'plu123']);
    }

    private function route(string $slug): string
    {
        return "/api/v1/users/{$slug}/novels";
    }

    private function publishedNovel(?Carbon $createdAt = null): Novel
    {
        $novel = Novel::factory()->create(['author_id' => $this->user->id, 'created_at' => $createdAt ?? now()]);
        Chapter::factory()->create(['novel_id' => $novel->id, 'author_id' => $this->user->id]);

        return $novel;
    }

    #[Test]
    public function lists_the_novels_created_by_the_user_most_recent_first(): void
    {
        $older = $this->publishedNovel(now()->subDay());
        $newer = $this->publishedNovel();
        Novel::factory()->create();

        $this->getJson($this->route('plu123'))
            ->assertOk()
            ->assertJsonPath('novels.*.id', [$newer->id, $older->id])
            ->assertJsonPath('novels.0.author.username', 'plume')
            ->assertJsonPath('meta.total', 2);
    }

    #[Test]
    public function leaves_out_a_novel_whose_first_chapter_is_a_draft(): void
    {
        $published = $this->publishedNovel();
        $unpublished = Novel::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->draft()->create(['novel_id' => $unpublished->id, 'author_id' => $this->user->id]);

        $this->getJson($this->route('plu123'))
            ->assertOk()
            ->assertJsonPath('novels.*.id', [$published->id]);
    }

    #[Test]
    public function paginates_the_novels(): void
    {
        Config::set('ghosty.profiles.per_page', 1);
        $this->publishedNovel(now()->subDay());
        $newer = $this->publishedNovel();

        $this->getJson($this->route('plu123'))
            ->assertOk()
            ->assertJsonPath('novels.*.id', [$newer->id])
            ->assertJsonPath('meta', ['current_page' => 1, 'per_page' => 1, 'total' => 2, 'last_page' => 2]);
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
        $route = Route::getRoutes()->getByAction(UserController::class.'@novels');
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
