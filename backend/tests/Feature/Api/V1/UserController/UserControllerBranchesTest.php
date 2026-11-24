<?php

namespace Tests\Feature\Api\V1\UserController;

use App\Http\Controllers\Api\V1\UserController;
use App\Models\Chapter;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserControllerBranchesTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['username' => 'plume', 'slug' => 'plu123']);
    }

    private function route(string $slug): string
    {
        return "/api/v1/users/{$slug}/branches";
    }

    #[Test]
    public function lists_the_continued_chapters_of_the_user_most_continued_first(): void
    {
        $once = Chapter::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->continuing($once)->create();
        $twice = Chapter::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->continuing($twice)->create();
        Chapter::factory()->continuing($twice)->create();

        $this->getJson($this->route('plu123'))
            ->assertOk()
            ->assertJsonPath('chapters.*.id', [$twice->id, $once->id])
            ->assertJsonPath('chapters.*.children_count', [2, 1])
            ->assertJsonPath('meta.total', 2);
    }

    #[Test]
    public function leaves_out_the_chapters_without_published_continuation(): void
    {
        $leaf = Chapter::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->continuing($leaf)->draft()->create();

        $this->getJson($this->route('plu123'))
            ->assertOk()
            ->assertJsonPath('chapters', []);
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
        $route = Route::getRoutes()->getByAction(UserController::class.'@branches');
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
