<?php

namespace Tests\Feature\Api\V1\AuthController;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthControllerLoginTest extends TestCase
{
    private string $route = '/api/v1/auth/login';

    /** @var array<string, mixed> */
    protected array $datas = [
        'email' => 'john@example.com',
        'password' => 'password123',
    ];

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(AuthController::class, 'login', LoginRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AuthController::class.'@login');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'throttle:login'], $route->gatherMiddleware());
    }

    #[Test]
    public function blocks_the_sixth_attempt_within_a_minute(): void
    {
        User::factory()->create(['email' => 'john@example.com', 'password' => 'password123']);

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->postJson($this->route, $this->getDatas(['password' => 'wrong-password']))->assertStatus(422);
        }

        $this->postJson($this->route, $this->getDatas())->assertStatus(429);
    }

    #[Test]
    public function keeps_the_token_out_of_the_response_body(): void
    {
        $user = User::factory()->create(['email' => 'john@example.com', 'password' => 'password123']);

        $response = $this->postJson($this->route, $this->getDatas());

        $response->assertOk();
        $response->assertJsonPath('user.id', $user->id);
        $response->assertJsonPath('user.email', 'john@example.com');
        $this->assertArrayNotHasKey('token', $response->json());

        $cookie = $response->getCookie('ghosty_token', false);
        $this->assertNotNull($cookie);
        $this->assertTrue($cookie->isHttpOnly());
        $this->assertSame('lax', $cookie->getSameSite());
        $this->assertIsString($cookie->getValue());
    }

    #[Test]
    public function the_issued_cookie_authenticates_the_next_request(): void
    {
        $user = User::factory()->create(['email' => 'john@example.com', 'password' => 'password123']);
        $token = $this->postJson($this->route, $this->getDatas())->getCookie('ghosty_token', false)->getValue();

        $response = $this->withCredentials()->withUnencryptedCookie('ghosty_token', $token)->getJson('/api/v1/auth/me');

        $response->assertOk();
        $response->assertJsonPath('user.id', $user->id);
    }

    #[Test]
    public function exposes_a_readable_session_hint_carrying_no_secret(): void
    {
        User::factory()->create(['email' => 'john@example.com', 'password' => 'password123']);

        $response = $this->postJson($this->route, $this->getDatas());

        $cookie = $response->getCookie('ghosty_session', false);
        $this->assertNotNull($cookie);
        $this->assertFalse($cookie->isHttpOnly());
        $this->assertSame('1', $cookie->getValue());
    }

    #[Test]
    public function rejects_wrong_password(): void
    {
        User::factory()->create(['email' => 'john@example.com', 'password' => 'password123']);

        $response = $this->postJson($this->route, $this->getDatas(['password' => 'wrong-password']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function rejects_unknown_email(): void
    {
        $response = $this->postJson($this->route, $this->getDatas());

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function rejects_banned_user(): void
    {
        User::factory()->banned()->create([
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson($this->route, $this->getDatas());

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function email_is_required(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['email' => '']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function password_is_required(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['password' => '']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }
}
