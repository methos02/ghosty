<?php

namespace Tests\Feature\Api\V1\CoverController;

use App\Models\Chapter;
use App\Models\Like;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\Report;
use App\Models\User;
use App\Repositories\NovelRepository;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CoverControllerIndexTest extends TestCase
{
    private Novel $novel;

    protected function setUp(): void
    {
        parent::setUp();

        $this->novel = Chapter::factory()->create()->novel;
    }

    private function route(): string
    {
        return "/api/v1/novels/{$this->novel->slug}/covers";
    }

    #[Test]
    public function lists_the_official_cover_first_then_by_likes_then_by_age(): void
    {
        $oldUnliked = NovelCover::factory()->on($this->novel)->create(['created_at' => now()->subDays(3)]);
        $mostLiked = NovelCover::factory()->on($this->novel)->liked(5)->create();
        $official = NovelCover::factory()->on($this->novel)->liked(2)->create();
        $newUnliked = NovelCover::factory()->on($this->novel)->create(['created_at' => now()->addMinute()]);
        app(NovelRepository::class)->setOfficialCover($this->novel->id, $official->id);

        $this->getJson($this->route())
            ->assertOk()
            ->assertJsonPath('covers.*.id', [$official->id, $mostLiked->id, $oldUnliked->id, $newUnliked->id])
            ->assertJsonPath('official_cover_id', $official->id);
    }

    #[Test]
    public function leaves_out_hidden_covers_and_covers_of_other_novels(): void
    {
        $visible = NovelCover::factory()->on($this->novel)->create();
        NovelCover::factory()->on($this->novel)->hidden()->create();
        NovelCover::factory()->create();

        $this->getJson($this->route())
            ->assertOk()
            ->assertJsonPath('covers.*.id', [$visible->id]);
    }

    #[Test]
    public function serves_a_cover_with_its_image_url_and_author(): void
    {
        $author = User::factory()->create(['username' => 'illustratrice']);
        $cover = NovelCover::factory()->on($this->novel)->by($author)->liked(3)->create(['image_path' => 'covers/1/aube.jpg']);

        $this->getJson($this->route())
            ->assertOk()
            ->assertJsonPath('covers.0.id', $cover->id)
            ->assertJsonPath('covers.0.novel_id', $this->novel->id)
            ->assertJsonPath('covers.0.image_url', Storage::disk('public')->url('covers/1/aube.jpg'))
            ->assertJsonPath('covers.0.like_count', 3)
            ->assertJsonPath('covers.0.comment_count', 0)
            ->assertJsonPath('covers.0.is_hidden', false)
            ->assertJsonPath('covers.0.author.username', 'illustratrice');
    }

    #[Test]
    public function tells_a_guest_nothing_about_their_likes_reports_or_proposal(): void
    {
        NovelCover::factory()->on($this->novel)->create();

        $this->getJson($this->route())
            ->assertOk()
            ->assertJsonPath('covers.0.is_liked', false)
            ->assertJsonPath('covers.0.is_reported', false)
            ->assertJsonPath('my_cover_id', null);
    }

    #[Test]
    public function tells_the_reader_what_they_liked_reported_and_proposed(): void
    {
        $reader = User::factory()->create();
        $liked = NovelCover::factory()->on($this->novel)->create();
        $reported = NovelCover::factory()->on($this->novel)->create();
        $own = NovelCover::factory()->on($this->novel)->by($reader)->create();
        Like::factory()->on($liked)->create(['user_id' => $reader->id]);
        Report::factory()->on($reported)->create(['reporter_id' => $reader->id]);

        $this->actingAs($reader)
            ->getJson($this->route())
            ->assertOk()
            ->assertJsonPath('covers.*.id', [$liked->id, $reported->id, $own->id])
            ->assertJsonPath('covers.*.is_liked', [true, false, false])
            ->assertJsonPath('covers.*.is_reported', [false, true, false])
            ->assertJsonPath('my_cover_id', $own->id);
    }

    #[Test]
    public function answers_not_found_for_an_unknown_novel(): void
    {
        $this->getJson('/api/v1/novels/inconnu/covers')->assertNotFound();
    }
}
