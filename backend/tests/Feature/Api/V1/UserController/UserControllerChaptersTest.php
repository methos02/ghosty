<?php

namespace Tests\Feature\Api\V1\UserController;

use App\Models\Chapter;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserControllerChaptersTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['username' => 'plume']);
    }

    private function route(string $username): string
    {
        return "/api/v1/users/{$username}/chapters";
    }

    #[Test]
    public function lists_the_published_chapters_most_recently_published_first(): void
    {
        $older = Chapter::factory()->create(['author_id' => $this->user->id, 'published_at' => now()->subDays(2)]);
        $newer = Chapter::factory()->create(['author_id' => $this->user->id]);

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('chapters.*.id', [$newer->id, $older->id])
            ->assertJsonPath('meta.total', 2);
    }

    #[Test]
    public function leaves_out_hidden_and_draft_chapters(): void
    {
        $published = Chapter::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->hidden()->create(['author_id' => $this->user->id]);
        Chapter::factory()->draft()->create(['author_id' => $this->user->id]);

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('chapters.*.id', [$published->id]);
    }

    #[Test]
    public function serves_the_novel_and_the_read_count_without_the_text(): void
    {
        $chapter = Chapter::factory()->create(['author_id' => $this->user->id, 'read_count' => 12]);

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('chapters.0.novel.slug', $chapter->novel->slug)
            ->assertJsonPath('chapters.0.read_count', 12)
            ->assertJsonMissingPath('chapters.0.content');
    }

    #[Test]
    public function marks_the_chapters_on_the_main_branch(): void
    {
        $root = Chapter::factory()->create();
        $mainChapter = Chapter::factory()->continuing($root)->liked(3)->create(['author_id' => $this->user->id, 'published_at' => now()->subDay()]);
        $rivalChapter = Chapter::factory()->continuing($root)->create(['author_id' => $this->user->id]);

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('chapters.*.id', [$rivalChapter->id, $mainChapter->id])
            ->assertJsonPath('chapters.*.is_in_main_branch', [false, true]);
    }

    #[Test]
    public function answers_not_found_for_an_unknown_username(): void
    {
        $this->getJson($this->route('inconnu'))
            ->assertNotFound();
    }
}
