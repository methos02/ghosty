<?php

namespace Tests\Feature\Api\V1\AuthController;

use App\Http\Controllers\Api\V1\AuthController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthControllerLogoutTest extends TestCase
{
    private string $route = '/api/v1/auth/logout';

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AuthController::class.'@logout');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route)->assertUnauthorized();
    }

    #[Test]
    public function revokes_current_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withCredentials()->withUnencryptedCookie('ghosty_token', $token)->postJson($this->route);

        $response->assertOk();
        $response->assertJsonPath('message', 'Déconnecté avec succès');
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    #[Test]
    public function expires_the_auth_cookies(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withCredentials()->withUnencryptedCookie('ghosty_token', $token)->postJson($this->route);

        $response->assertCookieExpired('ghosty_token');
        $response->assertCookieExpired('ghosty_session');
    }
}
