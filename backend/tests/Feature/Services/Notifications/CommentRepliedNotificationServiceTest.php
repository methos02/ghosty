<?php

namespace Tests\Feature\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentRepliedNotificationServiceTest extends TestCase
{
    use NotificationTestHelpers;

    #[Test]
    public function the_author_replying_to_their_own_comment_is_not_notified(): void
    {
        $comment = $this->commentOn(Chapter::factory()->create(), User::factory()->create());

        $this->replyTo($comment, $comment->author);

        $this->assertCount(0, $this->notificationsOf($comment->author, NotificationType::CommentReplied));
    }
}
