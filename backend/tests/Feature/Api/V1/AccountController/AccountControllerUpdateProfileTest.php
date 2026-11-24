<?php

namespace Tests\Feature\Api\V1\AccountController;

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\Testing\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AccountControllerUpdateProfileTest extends TestCase
{
    private string $route = '/api/v1/me/account/profile';

    private User $user;

    /** @var array<string, mixed> */
    protected array $datas = [
        'username' => 'Plume Noire',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->user = User::factory()->create(['username' => 'plume', 'slug' => 'plu123']);
    }

    private function portrait(string $name = 'portrait.png'): File
    {
        return UploadedFile::fake()->image($name, 400, 400);
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(AccountController::class, 'updateProfile', UpdateProfileRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AccountController::class.'@updateProfile');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:account'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route, $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function updates_the_profile_and_keeps_the_slug(): void
    {
        $this->actingAs($this->user)
            ->postJson($this->route, $this->getDatas())
            ->assertOk()
            ->assertJsonPath('username', 'Plume Noire')
            ->assertJsonPath('slug', 'plu123')
            ->assertJsonPath('profile_slug', 'plu123-plume-noire');

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'slug' => 'plu123',
            'username' => 'Plume Noire',
        ]);
    }

    #[Test]
    public function leaves_the_username_untouched_when_only_an_avatar_is_sent(): void
    {
        $this->actingAs($this->user)
            ->postJson($this->route, ['image' => $this->portrait()])
            ->assertOk()
            ->assertJsonPath('username', 'plume');
    }

    #[Test]
    public function ignores_the_notification_choice_which_has_its_own_route(): void
    {
        $this->user->forceFill(['notifications_enabled' => true])->save();

        $this->actingAs($this->user)
            ->postJson($this->route, $this->getDatas(['notifications_enabled' => false]))
            ->assertOk();

        $this->assertTrue($this->user->refresh()->notifications_enabled);
    }

    #[Test]
    public function accepts_a_new_case_of_the_own_username(): void
    {
        $this->actingAs($this->user)
            ->postJson($this->route, ['username' => 'PLUME'])
            ->assertOk()
            ->assertJsonPath('username', 'PLUME');
    }

    #[Test]
    public function refuses_the_username_of_another_account_whatever_the_case(): void
    {
        User::factory()->create(['username' => 'Encre']);

        $this->actingAs($this->user)
            ->postJson($this->route, ['username' => 'encre'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username' => __('validation.username.unique')]);
    }

    #[Test]
    public function refuses_an_empty_username(): void
    {
        $this->actingAs($this->user)
            ->postJson($this->route, ['username' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username' => __('validation.account.username.required')]);
    }

    #[Test]
    public function refuses_a_username_shorter_than_three_characters(): void
    {
        $this->actingAs($this->user)
            ->postJson($this->route, ['username' => 'ab'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username' => __('validation.account.username.min', ['min' => 3])]);
    }

    #[Test]
    public function refuses_a_username_longer_than_fifty_characters(): void
    {
        $this->actingAs($this->user)
            ->postJson($this->route, ['username' => str_repeat('a', 51)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username' => __('validation.username.max', ['max' => 50])]);
    }

    #[Test]
    public function refuses_the_prefix_of_deleted_accounts(): void
    {
        $this->actingAs($this->user)
            ->postJson($this->route, ['username' => 'deleted-plu123'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username' => __('validation.username.reserved')]);
    }

    #[Test]
    public function stores_the_avatar_sent_with_the_profile_in_the_folder_of_the_user(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson($this->route, $this->getDatas(['image' => $this->portrait()]))
            ->assertOk()
            ->assertJsonPath('username', 'Plume Noire');

        $avatar = $this->user->refresh()->avatar;
        $this->assertIsString($avatar);
        $this->assertStringStartsWith("avatars/{$this->user->id}/", $avatar);
        Storage::disk('public')->assertExists($avatar);
        $response->assertJsonPath('avatar_url', Storage::disk('public')->url($avatar));
    }

    #[Test]
    public function keeps_the_avatar_when_no_image_is_sent(): void
    {
        $this->actingAs($this->user)->postJson($this->route, ['image' => $this->portrait()])->assertOk();
        $avatar = $this->user->refresh()->avatar;

        $this->actingAs($this->user)->postJson($this->route, $this->getDatas())->assertOk();

        $this->assertSame($avatar, $this->user->refresh()->avatar);
    }

    #[Test]
    public function replaces_the_previous_avatar_file(): void
    {
        $this->actingAs($this->user)->postJson($this->route, ['image' => $this->portrait('ancien.png')])->assertOk();
        $previousAvatar = $this->user->refresh()->avatar;
        $this->assertIsString($previousAvatar);

        $this->actingAs($this->user)->postJson($this->route, ['image' => $this->portrait('nouveau.png')])->assertOk();

        Storage::disk('public')->assertMissing($previousAvatar);
        $this->assertNotSame($previousAvatar, $this->user->refresh()->avatar);
    }

    #[Test]
    public function refuses_an_image_of_another_format(): void
    {
        $this->actingAs($this->user)
            ->postJson($this->route, ['image' => UploadedFile::fake()->image('portrait.gif', 400, 400)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image' => __('validation.account.avatar.mimes')]);
    }

    #[Test]
    public function refuses_an_image_heavier_than_the_limit(): void
    {
        $maxSizeKb = Config::integer('ghosty.avatars.max_size_kb');

        $this->actingAs($this->user)
            ->postJson($this->route, ['image' => $this->portrait()->size($maxSizeKb + 1)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image' => __('validation.account.avatar.max', ['max' => $maxSizeKb])]);
    }
}
