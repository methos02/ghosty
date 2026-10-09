<?php

namespace Tests\Feature\Api\V1\NotificationController;

use App\Http\Controllers\Api\V1\NotificationController;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NotificationControllerMarkAsReadTest extends TestCase
{
    private User $recipient;

    private Notification $notification;

    protected function setUp(): void
    {
        parent::setUp();

        $this->recipient = User::factory()->create();
        $this->notification = Notification::factory()->to($this->recipient)->create([
            'updated_at' => now()->subHour(),
        ]);
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(NotificationController::class.'@markAsRead');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson("/api/v1/me/notifications/{$this->notification->id}/read")->assertUnauthorized();
    }

    #[Test]
    public function marks_the_notification_read_and_returns_what_remains_unread(): void
    {
        Notification::factory()->to($this->recipient)->create();

        $this->actingAs($this->recipient)
            ->postJson("/api/v1/me/notifications/{$this->notification->id}/read")
            ->assertOk()
            ->assertJsonPath('unread_count', 1);

        $this->assertNotNull($this->notification->refresh()->read_at);
    }

    #[Test]
    public function reading_does_not_move_the_notification_in_the_list(): void
    {
        $lastActivity = $this->notification->updated_at;

        $this->actingAs($this->recipient)
            ->postJson("/api/v1/me/notifications/{$this->notification->id}/read")
            ->assertOk();

        $this->assertEquals($lastActivity, $this->notification->refresh()->updated_at);
    }

    #[Test]
    public function cannot_read_the_notification_of_someone_else(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/me/notifications/{$this->notification->id}/read")
            ->assertNotFound();

        $this->assertNull($this->notification->refresh()->read_at);
    }
}
