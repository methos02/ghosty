<?php

namespace Tests\Feature\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Models\NovelCover;
use App\Models\User;
use App\Services\CoverLikeService;
use App\Services\LikeService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LikeReceivedNotificationServiceTest extends TestCase
{
    use NotificationTestHelpers;

    #[Test]
    public function a_support_notifies_the_author_of_the_chapter(): void
    {
        $chapter = Chapter::factory()->create();

        app(LikeService::class)->like(User::factory()->create(['username' => 'lectrice']), $chapter, null);

        $notification = $this->notificationsOf($chapter->author, NotificationType::LikeReceived)->sole();

        $this->assertSame($chapter->id, data_get($notification->data, 'chapter.id'));
        $this->assertSame('lectrice', $notification->data['last_actor_username']);
        $this->assertSame(1, $notification->data['count']);
    }

    #[Test]
    public function a_like_on_a_cover_notifies_the_illustrator_with_the_cover(): void
    {
        $cover = NovelCover::factory()->create();

        app(CoverLikeService::class)->like(User::factory()->create(['username' => 'lectrice']), $cover, null);

        $notification = $this->notificationsOf($cover->author, NotificationType::LikeReceived)->sole();

        $this->assertSame($cover->id, data_get($notification->data, 'cover.id'));
        $this->assertSame($cover->imageUrl(), data_get($notification->data, 'cover.image_url'));
        $this->assertNull($notification->data['chapter']);
        $this->assertSame($cover->novel->slug, data_get($notification->data, 'novel.slug'));
        $this->assertSame('lectrice', $notification->data['last_actor_username']);
        $this->assertSame(1, $notification->data['count']);
    }

    #[Test]
    public function supports_gather_in_a_single_unread_notification(): void
    {
        $chapter = Chapter::factory()->create();

        foreach (User::factory()->count(3)->create() as $reader) {
            app(LikeService::class)->like($reader, $chapter, null);
        }

        $this->assertSame(3, $this->notificationsOf($chapter->author, NotificationType::LikeReceived)->sole()->data['count']);
    }

    #[Test]
    public function the_first_support_stays_counted_when_the_notification_is_stamped_a_second_later(): void
    {
        $chapter = Chapter::factory()->create();
        $service = app(LikeService::class);

        $service->like(User::factory()->create(), $chapter, null);
        Notification::query()->update(['created_at' => now()->addSecond()]);
        $service->like(User::factory()->create(), $chapter, null);

        $this->assertSame(2, $this->notificationsOf($chapter->author, NotificationType::LikeReceived)->sole()->data['count']);
    }

    #[Test]
    public function withdrawing_then_supporting_again_does_not_inflate_the_count(): void
    {
        $chapter = Chapter::factory()->create();
        $reader = User::factory()->create();
        $service = app(LikeService::class);

        $service->like($reader, $chapter, null);
        $service->unlike($reader, $chapter);
        $service->like($reader, $chapter, null);

        $this->assertSame(1, $this->notificationsOf($chapter->author, NotificationType::LikeReceived)->sole()->data['count']);
    }
}
