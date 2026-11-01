<?php

namespace Tests\Feature\Services;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Services\Notifications\NotificationTestHelpers;
use Tests\TestCase;

class NotificationServiceTest extends TestCase
{
    use NotificationTestHelpers;

    #[Test]
    public function a_continuation_after_reading_opens_a_fresh_notification(): void
    {
        $parent = Chapter::factory()->create();
        $this->continueWith($parent, User::factory()->create());
        Notification::query()->update(['read_at' => now()]);

        $this->continueWith($parent, User::factory()->create());

        $notifications = $this->notificationsOf($parent->author, NotificationType::ChapterContinued);
        $this->assertCount(2, $notifications);
        $this->assertSame([1], $notifications->whereNull('read_at')->pluck('data.count')->all());
    }

    #[Test]
    public function an_author_who_turned_notifications_off_receives_nothing(): void
    {
        $author = User::factory()->create(['notifications_enabled' => false]);
        $parent = Chapter::factory()->create(['author_id' => $author->id]);

        $this->continueWith($parent, User::factory()->create());

        $this->assertDatabaseCount('notifications', 0);
    }
}
