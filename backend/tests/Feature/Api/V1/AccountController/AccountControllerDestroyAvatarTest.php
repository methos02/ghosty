<?php

namespace Tests\Feature\Api\V1\AccountController;

use App\Http\Controllers\Api\V1\AccountController;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AccountControllerDestroyAvatarTest extends TestCase
{
    private string $route = '/api/v1/me/account/avatar';

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AccountController::class.'@destroyAvatar');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:account'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->deleteJson($this->route)->assertUnauthorized();
    }

    #[Test]
    public function deletes_the_avatar_and_its_file(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $avatar = UploadedFile::fake()->image('portrait.png', 400, 400)->store("avatars/{$user->id}", 'public');
        $this->assertIsString($avatar);
        $user->forceFill(['avatar' => $avatar])->save();

        $this->actingAs($user)
            ->deleteJson($this->route)
            ->assertOk()
            ->assertJsonPath('avatar', null)
            ->assertJsonPath('avatar_url', null);

        Storage::disk('public')->assertMissing($avatar);
        $this->assertNull($user->refresh()->avatar);
    }

    #[Test]
    public function answers_the_user_without_avatar_unchanged(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->deleteJson($this->route)
            ->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('avatar_url', null);
    }
}
