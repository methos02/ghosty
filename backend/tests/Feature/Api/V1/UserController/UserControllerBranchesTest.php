<?php

namespace Tests\Feature\Api\V1\UserController;

use App\Models\Chapter;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserControllerBranchesTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['username' => 'plume']);
    }

    private function route(string $username): string
    {
        return "/api/v1/users/{$username}/branches";
    }

    #[Test]
    public function lists_the_continued_chapters_of_the_user_most_continued_first(): void
    {
        $once = Chapter::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->continuing($once)->create();
        $twice = Chapter::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->continuing($twice)->create();
        Chapter::factory()->continuing($twice)->create();

        $this->getJson($this->route('plume'))
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

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('chapters', []);
    }

    #[Test]
    public function answers_not_found_for_an_unknown_username(): void
    {
        $this->getJson($this->route('inconnu'))
            ->assertNotFound();
    }
}
