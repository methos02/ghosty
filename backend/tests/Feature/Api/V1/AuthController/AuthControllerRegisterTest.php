<?php

namespace Tests\Feature\Api\V1\AuthController;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthControllerRegisterTest extends TestCase
{
    private string $route = '/api/v1/auth/register';

    /** @var array<string, mixed> */
    protected array $datas = [
        'pseudo' => 'JohnDoe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(AuthController::class, 'register', RegisterRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AuthController::class.'@register');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'throttle:register'], $route->gatherMiddleware());
    }

    #[Test]
    public function blocks_the_sixth_registration_from_the_same_ip_within_an_hour(): void
    {
        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->postJson($this->route, $this->getDatas([
                'pseudo' => 'Ghost'.$attempt,
                'email' => "ghost{$attempt}@example.com",
            ]))->assertCreated();
        }

        $this->postJson($this->route, $this->getDatas())->assertStatus(429);
    }

    #[Test]
    public function registers_user_and_signs_it_in_through_an_httponly_cookie(): void
    {
        $response = $this->postJson($this->route, $this->getDatas());

        $response->assertCreated();
        $response->assertJsonPath('user.pseudo', 'JohnDoe');
        $response->assertJsonPath('user.email', 'john@example.com');
        $response->assertJsonPath('user.roles', [User::ROLE_READER]);
        $this->assertArrayNotHasKey('token', $response->json());

        $cookie = $response->getCookie('ghosty_token', false);
        $this->assertNotNull($cookie);
        $this->assertTrue($cookie->isHttpOnly());

        $this->assertDatabaseHas('users', ['email' => 'john@example.com', 'pseudo' => 'JohnDoe']);
    }

    #[Test]
    public function password_is_hashed(): void
    {
        $this->postJson($this->route, $this->getDatas());

        $user = User::where('email', 'john@example.com')->firstOrFail();
        $this->assertNotSame('password123', $user->password);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    #[Test]
    public function pseudo_is_required(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['pseudo' => '']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['pseudo']);
    }

    #[Test]
    public function pseudo_must_be_at_least_three_chars(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['pseudo' => 'ab']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['pseudo']);
    }

    #[Test]
    public function pseudo_must_be_unique(): void
    {
        User::factory()->create(['pseudo' => 'JohnDoe']);

        $response = $this->postJson($this->route, $this->getDatas());

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['pseudo']);
    }

    #[Test]
    public function email_is_required(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['email' => '']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function email_must_be_valid(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['email' => 'not-an-email']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function email_must_be_unique(): void
    {
        User::factory()->create(['email' => 'john@example.com']);

        $response = $this->postJson($this->route, $this->getDatas());

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function password_is_required(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['password' => '', 'password_confirmation' => '']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    #[Test]
    public function password_must_be_at_least_eight_chars(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['password' => 'short', 'password_confirmation' => 'short']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    #[Test]
    public function password_must_be_confirmed(): void
    {
        $response = $this->postJson($this->route, $this->getDatas(['password_confirmation' => 'different']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }
}
