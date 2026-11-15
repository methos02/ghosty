<?php

namespace Tests\Feature\Api\V1\UserController;

use App\Models\Chapter;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\Report;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserControllerShowTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['username' => 'plume', 'roles' => [User::ROLE_READER, User::ROLE_AUTHOR]]);
    }

    private function route(string $username): string
    {
        return "/api/v1/users/{$username}";
    }

    #[Test]
    public function serves_the_public_identity_of_the_user(): void
    {
        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('id', $this->user->id)
            ->assertJsonPath('username', 'plume')
            ->assertJsonPath('roles', [User::ROLE_READER, User::ROLE_AUTHOR])
            ->assertJsonPath('created_at', $this->user->created_at->toIso8601String())
            ->assertJsonMissingPath('email');
    }

    #[Test]
    public function answers_not_found_for_an_unknown_username(): void
    {
        $this->getJson($this->route('inconnu'))
            ->assertNotFound();
    }

    #[Test]
    public function serves_zero_statistics_for_a_user_without_contribution(): void
    {
        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('statistics', [
                'read_count' => 0,
                'like_count' => 0,
                'received_continuation_count' => 0,
                'novel_count' => 0,
                'chapter_count' => 0,
                'cover_count' => 0,
                'official_cover_count' => 0,
            ]);
    }

    #[Test]
    public function counts_the_published_and_archived_chapters_with_their_reads_and_likes(): void
    {
        Chapter::factory()->liked(3)->create(['author_id' => $this->user->id, 'read_count' => 10]);
        Chapter::factory()->archived()->liked(1)->create(['author_id' => $this->user->id, 'read_count' => 4]);
        Chapter::factory()->hidden()->liked(5)->create(['author_id' => $this->user->id, 'read_count' => 100]);
        Chapter::factory()->draft()->create(['author_id' => $this->user->id]);

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('statistics.chapter_count', 2)
            ->assertJsonPath('statistics.read_count', 14)
            ->assertJsonPath('statistics.like_count', 4);
    }

    #[Test]
    public function adds_the_likes_of_the_published_covers(): void
    {
        Chapter::factory()->liked(2)->create(['author_id' => $this->user->id]);
        NovelCover::factory()->by($this->user)->liked(5)->create();
        NovelCover::factory()->by($this->user)->hidden()->liked(7)->create();

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('statistics.like_count', 7)
            ->assertJsonPath('statistics.cover_count', 1);
    }

    #[Test]
    public function counts_the_official_covers(): void
    {
        $novel = Novel::factory()->create();
        $official = NovelCover::factory()->on($novel)->by($this->user)->create();
        $novel->forceFill(['official_cover_id' => $official->id])->save();
        NovelCover::factory()->by($this->user)->create();

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('statistics.cover_count', 2)
            ->assertJsonPath('statistics.official_cover_count', 1);
    }

    #[Test]
    public function counts_only_the_published_continuations_written_by_others(): void
    {
        $chapter = Chapter::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->continuing($chapter)->create();
        Chapter::factory()->continuing($chapter)->create();
        Chapter::factory()->continuing($chapter)->draft()->create();
        Chapter::factory()->continuing($chapter)->create(['author_id' => $this->user->id]);

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('statistics.received_continuation_count', 2);
    }

    #[Test]
    public function counts_the_novels_whose_first_chapter_is_published(): void
    {
        $published = Novel::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->create(['novel_id' => $published->id, 'author_id' => $this->user->id]);
        $unpublished = Novel::factory()->create(['author_id' => $this->user->id]);
        Chapter::factory()->draft()->create(['novel_id' => $unpublished->id, 'author_id' => $this->user->id]);

        $this->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('statistics.novel_count', 1);
    }

    #[Test]
    public function tells_the_viewer_whether_they_already_reported_the_user(): void
    {
        $reporter = User::factory()->create();
        Report::factory()->on($this->user)->create(['reporter_id' => $reporter->id]);

        $this->actingAs($reporter)
            ->getJson($this->route('plume'))
            ->assertOk()
            ->assertJsonPath('is_reported', true);
    }
}
