<?php

namespace Tests\Feature\Api\V1\AccountController;

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Requests\UpdatePasswordRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Testing\TestResponse;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class AccountControllerUpdatePasswordTest extends TestCase
{
    private string $route = '/api/v1/me/account/password';

    private User $user;

    /** @var array<string, mixed> */
    protected array $datas = [
        'current_password' => 'password123',
        'password' => 'nouveau-secret',
        'password_confirmation' => 'nouveau-secret',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['password' => 'password123']);
    }

    /**
     * @param  array<string, mixed>  $datas
     * @return TestResponse<Response>
     */
    private function putWithToken(string $token, array $datas): TestResponse
    {
        return $this->withCredentials()
            ->withUnencryptedCookie('ghosty_token', $token)
            ->putJson($this->route, $datas);
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(AccountController::class, 'updatePassword', UpdatePasswordRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AccountController::class.'@updatePassword');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:account'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->putJson($this->route, $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function updates_the_password(): void
    {
        $token = $this->user->createToken('auth-token')->plainTextToken;

        $this->putWithToken($token, $this->getDatas())->assertNoContent();

        $this->assertTrue(Hash::check('nouveau-secret', $this->user->refresh()->password));
    }

    #[Test]
    public function revokes_the_other_sessions_and_keeps_the_current_one(): void
    {
        $currentToken = $this->user->createToken('auth-token');
        $this->user->createToken('auth-token');
        $otherUserToken = User::factory()->create()->createToken('auth-token');

        $this->putWithToken($currentToken->plainTextToken, $this->getDatas())->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 2);
        $this->assertDatabaseHas('personal_access_tokens', ['id' => $currentToken->accessToken->id]);
        $this->assertDatabaseHas('personal_access_tokens', ['id' => $otherUserToken->accessToken->id]);
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

        $this->assertTrue(Hash::check('password123', $this->user->refresh()->password));
    }

    #[Test]
    public function requires_the_new_password(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['password' => '', 'password_confirmation' => '']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password' => __('validation.account.password.required')]);
    }

    #[Test]
    public function refuses_a_new_password_shorter_than_eight_characters(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['password' => 'court', 'password_confirmation' => 'court']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password' => __('validation.account.password.min', ['min' => 8])]);
    }

    #[Test]
    public function refuses_a_new_password_without_matching_confirmation(): void
    {
        $this->actingAs($this->user)
            ->putJson($this->route, $this->getDatas(['password_confirmation' => 'autre-secret']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password' => __('validation.account.password.confirmed')]);
    }
}
