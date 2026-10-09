<?php

namespace Tests\Feature\Models;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NotificationModelTest extends TestCase
{
    #[Test]
    public function a_group_holds_a_single_unread_notification_per_recipient(): void
    {
        $recipient = User::factory()->create();
        Notification::factory()->to($recipient)->create(['group_key' => 'like_received:chapter:1']);

        $this->expectException(UniqueConstraintViolationException::class);

        Notification::factory()->to($recipient)->create(['group_key' => 'like_received:chapter:1']);
    }

    #[Test]
    public function a_read_notification_leaves_its_group_open_for_the_next_one(): void
    {
        $recipient = User::factory()->create();
        Notification::factory()->to($recipient)->read()->create(['group_key' => 'like_received:chapter:1']);

        Notification::factory()->to($recipient)->create(['group_key' => 'like_received:chapter:1']);

        $this->assertDatabaseCount('notifications', 2);
    }

    #[Test]
    public function the_same_group_stays_open_to_every_recipient(): void
    {
        Notification::factory()->create(['group_key' => 'like_received:chapter:1']);

        Notification::factory()->create(['group_key' => 'like_received:chapter:1']);

        $this->assertDatabaseCount('notifications', 2);
    }
}
