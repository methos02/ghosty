<?php

namespace Tests\Feature\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentReceivedNotificationServiceTest extends TestCase
{
    use NotificationTestHelpers;

    #[Test]
    public function the_author_commenting_their_own_chapter_is_not_notified(): void
    {
        $chapter = Chapter::factory()->create();

        $this->commentOn($chapter, $chapter->author);

        $this->assertCount(0, $this->notificationsOf($chapter->author, NotificationType::CommentReceived));
    }

    #[Test]
    public function successive_comments_on_a_chapter_gather_in_a_single_unread_notification(): void
    {
        $chapter = Chapter::factory()->create();
        $this->commentOn($chapter, User::factory()->create());
        $lastCommenter = User::factory()->create();
        $this->commentOn($chapter, $lastCommenter);

        $notification = $this->notificationsOf($chapter->author, NotificationType::CommentReceived)->sole();
        $this->assertSame(2, $notification->data['count']);
        $this->assertSame($lastCommenter->username, $notification->data['last_actor_username']);
        $this->assertSame($chapter->id, data_get($notification->data, 'chapter.id'));
    }
}
