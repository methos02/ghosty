<?php

namespace Tests\Feature\Api\V1\AccountController;

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Requests\UsernameAvailabilityRequest;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AccountControllerUsernameAvailabilityTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['username' => 'Plume']);
    }

    private function route(string $username): string
    {
        return '/api/v1/me/account/username-availability?username='.urlencode($username);
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(AccountController::class, 'usernameAvailability', UsernameAvailabilityRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AccountController::class.'@usernameAvailability');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:username-availability'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson($this->route('Encre'))->assertUnauthorized();
    }

    #[Test]
    public function answers_available_for_an_unused_username(): void
    {
        $this->actingAs($this->user)
            ->getJson($this->route('Encre'))
            ->assertOk()
            ->assertExactJson(['available' => true]);
    }

    #[Test]
    public function answers_unavailable_for_the_username_of_another_account_whatever_the_case(): void
    {
        User::factory()->create(['username' => 'Encre']);

        $this->actingAs($this->user)
            ->getJson($this->route('eNCRE'))
            ->assertOk()
            ->assertExactJson(['available' => false]);
    }

    #[Test]
    public function answers_available_for_the_own_username_of_the_user(): void
    {
        $this->actingAs($this->user)
            ->getJson($this->route('plume'))
            ->assertOk()
            ->assertExactJson(['available' => true]);
    }

    #[Test]
    public function requires_the_username(): void
    {
        $this->actingAs($this->user)
            ->getJson('/api/v1/me/account/username-availability')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username' => __('validation.account.username.required')]);
    }
}
