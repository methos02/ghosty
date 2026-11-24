<?php

namespace Tests\Feature\Api\V1\AccountController;

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Requests\UpdateEmailRequest;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AccountControllerUpdateEmailTest extends TestCase
{
    private string $route = '/api/v1/me/account/email';

    private User $user;

    /** @var array<string, mixed> */
    protected array $datas = [
        'email' => 'nouvelle@example.com',
        'current_password' => 'password123',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['email' => 'ancienne@example.com', 'password' => 'password123']);
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(AccountController::class, 'updateEmail', UpdateEmailRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AccountController::class.'@updateEmail');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:account'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->putJson($this->route, $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function updates_the_email(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas())
            ->assertOk()
            ->assertJsonPath('id', $this->user->id)
            ->assertJsonPath('email', 'nouvelle@example.com');

        $this->assertDatabaseHas('users', ['id' => $this->user->id, 'email' => 'nouvelle@example.com']);
    }

    #[Test]
    public function requires_the_current_password(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['current_password' => '']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password' => __('validation.account.current_password.required')]);
    }

    #[Test]
    public function refuses_a_wrong_current_password(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['current_password' => 'wrong-password']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password' => __('validation.account.current_password.current_password')]);

        $this->assertDatabaseHas('users', ['id' => $this->user->id, 'email' => 'ancienne@example.com']);
    }

    #[Test]
    public function requires_the_email(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['email' => '']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => __('validation.account.email.required')]);
    }

    #[Test]
    public function refuses_an_invalid_email(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['email' => 'pas-un-email']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => __('validation.account.email.email')]);
    }

    #[Test]
    public function refuses_the_email_of_another_account(): void
    {
        User::factory()->create(['email' => 'nouvelle@example.com']);

        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => __('validation.account.email.unique')]);
    }

    #[Test]
    public function accepts_the_current_email_of_the_user(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['email' => 'ancienne@example.com']))
            ->assertOk()
            ->assertJsonPath('email', 'ancienne@example.com');
    }
}
