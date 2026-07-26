<?php

namespace Tests\Feature\Api\V1\AuthController;

use App\Http\Controllers\Api\V1\AuthController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthControllerMeTest extends TestCase
{
    private string $route = '/api/v1/auth/me';

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AuthController::class.'@me');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson($this->route)->assertUnauthorized();
    }

    #[Test]
    public function returns_authenticated_user(): void
    {
        $user = User::factory()->create(['pseudo' => 'JohnDoe', 'email' => 'john@example.com']);
        Sanctum::actingAs($user);

        $response = $this->getJson($this->route);

        $response->assertOk();
        $response->assertJsonPath('user.id', $user->id);
        $response->assertJsonPath('user.pseudo', 'JohnDoe');
        $response->assertJsonPath('user.email', 'john@example.com');
        $response->assertJsonMissingPath('user.password');
    }
}
