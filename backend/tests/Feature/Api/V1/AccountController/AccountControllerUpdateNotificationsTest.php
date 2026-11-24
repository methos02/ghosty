<?php

namespace Tests\Feature\Api\V1\AccountController;

use App\Enums\NotificationType;
use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Requests\UpdateNotificationPreferencesRequest;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AccountControllerUpdateNotificationsTest extends TestCase
{
    private string $route = '/api/v1/me/account/notifications';

    private User $user;

    /** @var array<string, mixed> */
    protected array $datas = [
        'notifications_enabled' => true,
        'disabled_notification_types' => ['like_received', 'comment_replied'],
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(AccountController::class, 'updateNotifications', UpdateNotificationPreferencesRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AccountController::class.'@updateNotifications');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:account'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->putJson($this->route, $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function stores_the_disabled_notification_types(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas())
            ->assertOk()
            ->assertJsonPath('notifications_enabled', true)
            ->assertJsonPath('disabled_notification_types', ['like_received', 'comment_replied']);

        $this->assertSame(['like_received', 'comment_replied'], $this->user->refresh()->disabled_notification_types);
    }

    #[Test]
    public function turns_every_notification_off_at_once(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['notifications_enabled' => false]))
            ->assertOk()
            ->assertJsonPath('notifications_enabled', false);

        $this->assertFalse($this->user->refresh()->notifications_enabled);
    }

    #[Test]
    public function enables_every_type_again_with_an_empty_list(): void
    {
        $this->user->forceFill(['disabled_notification_types' => ['like_received']])->save();

        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['disabled_notification_types' => []]))
            ->assertOk()
            ->assertJsonPath('disabled_notification_types', []);
    }

    #[Test]
    public function refuses_a_notification_choice_that_is_not_a_boolean(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['notifications_enabled' => 'souvent']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['notifications_enabled' => __('validation.account.notifications_enabled.boolean')]);
    }

    #[Test]
    public function requires_the_list_of_disabled_types(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, ['notifications_enabled' => true])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['disabled_notification_types' => __('validation.account.disabled_notification_types.array')]);
    }

    #[Test]
    public function refuses_an_unknown_notification_type(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['disabled_notification_types' => ['newsletter']]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['disabled_notification_types.0' => __('validation.account.disabled_notification_types.in')]);
    }

    #[Test]
    public function refuses_to_disable_the_moderation_notice(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['disabled_notification_types' => [NotificationType::ContentModerated->value]]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['disabled_notification_types.0' => __('validation.account.disabled_notification_types.in')]);
    }
}
