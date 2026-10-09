<?php

namespace Tests\Feature\Api\V1\NotificationController;

use App\Http\Controllers\Api\V1\NotificationController;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NotificationControllerMarkAllAsReadTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(NotificationController::class.'@markAllAsRead');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->patchJson('/api/v1/me/notifications/read-all')->assertUnauthorized();
    }

    #[Test]
    public function marks_every_notification_of_the_reader_read(): void
    {
        $recipient = User::factory()->create();
        Notification::factory()->to($recipient)->count(3)->create();

        $this->actingAs($recipient)
            ->patchJson('/api/v1/me/notifications/read-all')
            ->assertOk()
            ->assertJsonPath('unread_count', 0);

        $this->assertDatabaseMissing('notifications', ['notifiable_id' => $recipient->id, 'read_at' => null]);
    }

    #[Test]
    public function leaves_the_notifications_of_others_unread(): void
    {
        $other = Notification::factory()->create();

        $this->actingAs(User::factory()->create())
            ->patchJson('/api/v1/me/notifications/read-all')
            ->assertOk();

        $this->assertNull($other->refresh()->read_at);
    }
}
