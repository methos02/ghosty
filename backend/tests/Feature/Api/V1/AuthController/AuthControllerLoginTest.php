<?php

namespace Tests\Feature\Api\V1\AuthController;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Requests\LoginRequest;
use App\Models\User;
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
    public function returns_token_on_valid_credentials(): void
    {
        $user = User::factory()->create(['email' => 'john@example.com', 'password' => 'password123']);

        $response = $this->postJson($this->route, $this->getDatas());

        $response->assertOk();
        $response->assertJsonPath('user.id', $user->id);
        $response->assertJsonPath('user.email', 'john@example.com');
        $this->assertIsString($response->json('token'));
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
