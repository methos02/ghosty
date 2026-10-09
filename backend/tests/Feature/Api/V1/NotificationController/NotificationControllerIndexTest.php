<?php

namespace Tests\Feature\Api\V1\NotificationController;

use App\Http\Controllers\Api\V1\NotificationController;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NotificationControllerIndexTest extends TestCase
{
    private User $recipient;

    protected function setUp(): void
    {
        parent::setUp();

        $this->recipient = User::factory()->create();
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(NotificationController::class.'@index');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson('/api/v1/me/notifications')->assertUnauthorized();
    }

    #[Test]
    public function serves_the_type_and_the_data_of_each_notification(): void
    {
        $notification = Notification::factory()->to($this->recipient)->create([
            'type' => 'chapter_continued',
            'data' => ['chapter' => ['id' => 7, 'title' => 'Le phare'], 'count' => 2],
        ]);

        $this->actingAs($this->recipient)
            ->getJson('/api/v1/me/notifications')
            ->assertOk()
            ->assertJsonPath('notifications.0.id', $notification->id)
            ->assertJsonPath('notifications.0.type', 'chapter_continued')
            ->assertJsonPath('notifications.0.data.chapter.title', 'Le phare')
            ->assertJsonPath('notifications.0.data.count', 2)
            ->assertJsonPath('notifications.0.is_read', false);
    }

    #[Test]
    public function lists_only_the_notifications_of_the_reader(): void
    {
        $own = Notification::factory()->to($this->recipient)->create();
        Notification::factory()->create();

        $this->actingAs($this->recipient)
            ->getJson('/api/v1/me/notifications')
            ->assertOk()
            ->assertJsonPath('notifications.*.id', [$own->id]);
    }

    #[Test]
    public function the_latest_activity_comes_first(): void
    {
        $older = Notification::factory()->to($this->recipient)->create(['updated_at' => now()->subDay()]);
        $refreshed = Notification::factory()->to($this->recipient)->create([
            'created_at' => now()->subWeek(),
            'updated_at' => now(),
        ]);

        $this->actingAs($this->recipient)
            ->getJson('/api/v1/me/notifications')
            ->assertOk()
            ->assertJsonPath('notifications.*.id', [$refreshed->id, $older->id]);
    }

    #[Test]
    public function counts_the_unread_notifications(): void
    {
        Notification::factory()->to($this->recipient)->count(2)->create();
        Notification::factory()->to($this->recipient)->read()->create();

        $this->actingAs($this->recipient)
            ->getJson('/api/v1/me/notifications')
            ->assertOk()
            ->assertJsonPath('unread_count', 2);
    }

    #[Test]
    public function paginates_with_the_configured_page_size(): void
    {
        Config::set('ghosty.notifications.per_page', 2);
        Notification::factory()->to($this->recipient)->count(3)->create();

        $this->actingAs($this->recipient)
            ->getJson('/api/v1/me/notifications?page=2')
            ->assertOk()
            ->assertJsonCount(1, 'notifications')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('meta.total', 3);
    }
}
