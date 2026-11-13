<?php

namespace Tests\Feature\Services;

use App\Enums\NotificationType;
use App\Models\Notification;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Services\OfficialCoverService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OfficialCoverServiceTest extends TestCase
{
    private Novel $novel;

    protected function setUp(): void
    {
        parent::setUp();

        $this->novel = Novel::factory()->create();
    }

    private function officialCoverId(): ?int
    {
        return Novel::query()->findOrFail($this->novel->id)->official_cover_id;
    }

    #[Test]
    public function without_official_cover_the_most_liked_one_is_elected(): void
    {
        NovelCover::factory()->on($this->novel)->liked(1)->create();
        $mostLiked = NovelCover::factory()->on($this->novel)->liked(4)->create();

        app(OfficialCoverService::class)->update($this->novel->id, null);

        $this->assertSame($mostLiked->id, $this->officialCoverId());
    }

    #[Test]
    public function among_unliked_covers_the_oldest_is_elected(): void
    {
        NovelCover::factory()->on($this->novel)->create(['created_at' => now()]);
        $oldest = NovelCover::factory()->on($this->novel)->create(['created_at' => now()->subDay()]);

        app(OfficialCoverService::class)->update($this->novel->id, null);

        $this->assertSame($oldest->id, $this->officialCoverId());
    }

    #[Test]
    public function a_tie_keeps_the_current_official_cover(): void
    {
        $official = NovelCover::factory()->on($this->novel)->liked(2)->create(['created_at' => now()]);
        NovelCover::factory()->on($this->novel)->liked(2)->create(['created_at' => now()->subDay()]);
        $this->novel->forceFill(['official_cover_id' => $official->id])->save();

        app(OfficialCoverService::class)->update($this->novel->id, null);

        $this->assertSame($official->id, $this->officialCoverId());
    }

    #[Test]
    public function a_hidden_cover_is_never_elected(): void
    {
        $visible = NovelCover::factory()->on($this->novel)->create();
        NovelCover::factory()->on($this->novel)->liked(9)->hidden()->create();

        app(OfficialCoverService::class)->update($this->novel->id, null);

        $this->assertSame($visible->id, $this->officialCoverId());
    }

    #[Test]
    public function notifies_the_illustrator_whose_cover_becomes_official(): void
    {
        $cover = NovelCover::factory()->on($this->novel)->create();

        app(OfficialCoverService::class)->update($this->novel->id, null);

        $notification = Notification::query()
            ->where('notifiable_id', $cover->author_id)
            ->where('type', NotificationType::CoverSelected->value)
            ->sole();
        $this->assertSame($cover->id, data_get($notification->data, 'cover.id'));
        $this->assertNull($notification->data['chapter']);
        $this->assertSame($this->novel->slug, data_get($notification->data, 'novel.slug'));
    }

    #[Test]
    public function the_illustrator_who_caused_the_selection_is_not_notified(): void
    {
        $cover = NovelCover::factory()->on($this->novel)->create();

        app(OfficialCoverService::class)->update($this->novel->id, $cover->author_id);

        $this->assertDatabaseMissing('notifications', ['type' => NotificationType::CoverSelected->value]);
    }

    #[Test]
    public function an_unchanged_official_cover_notifies_nobody(): void
    {
        $official = NovelCover::factory()->on($this->novel)->create();
        $this->novel->forceFill(['official_cover_id' => $official->id])->save();

        app(OfficialCoverService::class)->update($this->novel->id, null);

        $this->assertDatabaseMissing('notifications', ['type' => NotificationType::CoverSelected->value]);
    }

    #[Test]
    public function the_dethroned_illustrator_is_not_notified(): void
    {
        $official = NovelCover::factory()->on($this->novel)->create();
        NovelCover::factory()->on($this->novel)->liked(1)->create();
        $this->novel->forceFill(['official_cover_id' => $official->id])->save();

        app(OfficialCoverService::class)->update($this->novel->id, null);

        $this->assertDatabaseMissing('notifications', ['notifiable_id' => $official->author_id]);
    }
}
