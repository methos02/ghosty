<?php

namespace Tests\Feature\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\User;
use App\Services\ChapterService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterContinuedNotificationServiceTest extends TestCase
{
    use NotificationTestHelpers;

    #[Test]
    public function a_published_continuation_notifies_the_author_of_the_parent(): void
    {
        $parent = Chapter::factory()->create();
        $continuation = $this->continueWith($parent, User::factory()->create(['username' => 'plume']));

        $notification = $this->notificationsOf($parent->author, NotificationType::ChapterContinued)->sole();

        $this->assertSame($parent->id, data_get($notification->data, 'chapter.id'));
        $this->assertSame($continuation->id, data_get($notification->data, 'continuation.id'));
        $this->assertSame('plume', data_get($notification->data, 'continuation.author_username'));
        $this->assertSame(1, $notification->data['count']);
    }

    #[Test]
    public function continuing_ones_own_chapter_notifies_nobody(): void
    {
        $parent = Chapter::factory()->create();

        $this->continueWith($parent, $parent->author);

        $this->assertDatabaseCount('notifications', 0);
    }

    #[Test]
    public function a_draft_continuation_notifies_nobody(): void
    {
        $parent = Chapter::factory()->create();

        $this->continueWith($parent, User::factory()->create(), asDraft: true);

        $this->assertCount(0, $this->notificationsOf($parent->author, NotificationType::ChapterContinued));
    }

    #[Test]
    public function publishing_a_draft_continuation_notifies_the_author_of_the_parent(): void
    {
        $parent = Chapter::factory()->create();
        $draft = $this->continueWith($parent, User::factory()->create(), asDraft: true);

        app(ChapterService::class)->publish($draft);

        $this->assertCount(1, $this->notificationsOf($parent->author, NotificationType::ChapterContinued));
    }

    #[Test]
    public function successive_continuations_gather_in_a_single_unread_notification(): void
    {
        $parent = Chapter::factory()->create();
        $this->continueWith($parent, User::factory()->create());
        $latest = $this->continueWith($parent, User::factory()->create());

        $notification = $this->notificationsOf($parent->author, NotificationType::ChapterContinued)->sole();

        $this->assertSame(2, $notification->data['count']);
        $this->assertSame($latest->id, data_get($notification->data, 'continuation.id'));
    }
}
