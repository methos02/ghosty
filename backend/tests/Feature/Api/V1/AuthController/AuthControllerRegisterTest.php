<?php

namespace Tests\Feature\Api\V1\AuthController;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
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
    public function registers_user_and_returns_token(): void
    {
        $response = $this->postJson($this->route, $this->getDatas());

        $response->assertCreated();
        $response->assertJsonPath('user.pseudo', 'JohnDoe');
        $response->assertJsonPath('user.email', 'john@example.com');
        $response->assertJsonPath('user.roles', [User::ROLE_READER]);
        $this->assertIsString($response->json('token'));

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
