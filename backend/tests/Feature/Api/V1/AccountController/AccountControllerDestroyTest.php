<?php

namespace Tests\Feature\Api\V1\AccountController;

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Requests\DeleteAccountRequest;
use App\Models\Chapter;
use App\Models\ChapterRead;
use App\Models\Comment;
use App\Models\Follow;
use App\Models\Like;
use App\Models\Notification;
use App\Models\ReadingProgress;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class AccountControllerDestroyTest extends TestCase
{
    private string $route = '/api/v1/me/account';

    private User $user;

    /** @var array<string, mixed> */
    protected array $datas = [
        'current_password' => 'password123',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'username' => 'plume',
            'slug' => 'plu123',
            'email' => 'plume@example.com',
            'password' => 'password123',
        ]);
    }

    /**
     * @return TestResponse<Response>
     */
    private function deleteAccount(): TestResponse
    {
        $token = $this->user->createToken('auth-token')->plainTextToken;

        return $this->withCredentials()
            ->withUnencryptedCookie('ghosty_token', $token)
            ->deleteJson($this->route, $this->getDatas());
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(AccountController::class, 'destroy', DeleteAccountRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(AccountController::class.'@destroy');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:account'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->deleteJson($this->route, $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function anonymizes_the_account(): void
    {
        $this->deleteAccount()->assertNoContent();

        $deleted = $this->user->refresh();
        $this->assertTrue($deleted->isDeleted());
        $this->assertSame('plu123', $deleted->slug);
        $this->assertSame('deleted-plu123', $deleted->username);
        $this->assertSame('deleted-plu123@ghosty.invalid', $deleted->email);
        $this->assertFalse(Hash::check('password123', $deleted->password));
    }

    #[Test]
    public function revokes_every_token_and_expires_the_auth_cookies(): void
    {
        $this->user->createToken('auth-token');

        $response = $this->deleteAccount();

        $response->assertNoContent();
        $response->assertCookieExpired('ghosty_token');
        $response->assertCookieExpired('ghosty_session');
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    #[Test]
    public function deletes_the_avatar_file(): void
    {
        Storage::fake('public');
        $avatar = UploadedFile::fake()->image('portrait.png', 400, 400)->store("avatars/{$this->user->id}", 'public');
        $this->assertIsString($avatar);
        $this->user->forceFill(['avatar' => $avatar])->save();

        $this->deleteAccount()->assertNoContent();

        Storage::disk('public')->assertMissing($avatar);
        $this->assertNull($this->user->refresh()->avatar);
    }

    #[Test]
    public function deletes_the_follows_the_reading_progress_and_the_notifications(): void
    {
        $chapter = Chapter::factory()->create();
        Follow::factory()->by($this->user)->on($chapter)->create();
        ReadingProgress::factory()->by($this->user)->at($chapter)->create();
        Notification::factory()->to($this->user)->create();

        $this->deleteAccount()->assertNoContent();

        $this->assertDatabaseCount('follows', 0);
        $this->assertDatabaseCount('reading_progress', 0);
        $this->assertDatabaseCount('notifications', 0);
    }

    #[Test]
    public function keeps_the_reads_without_the_reader(): void
    {
        $chapter = Chapter::factory()->create();
        ChapterRead::factory()->by($this->user)->on($chapter)->create();

        $this->deleteAccount()->assertNoContent();

        $this->assertDatabaseCount('chapter_reads', 1);
        $this->assertDatabaseHas('chapter_reads', ['chapter_id' => $chapter->id, 'user_id' => null]);
    }

    #[Test]
    public function keeps_the_contents_and_the_likes_of_the_account(): void
    {
        $chapter = Chapter::factory()->create(['author_id' => $this->user->id]);
        $comment = Comment::factory()->by($this->user)->create();
        $like = Like::factory()->on(Chapter::factory()->create())->create(['user_id' => $this->user->id]);

        $this->deleteAccount()->assertNoContent();

        $this->assertDatabaseHas('chapters', ['id' => $chapter->id, 'author_id' => $this->user->id]);
        $this->assertDatabaseHas('comments', ['id' => $comment->id, 'author_id' => $this->user->id]);
        $this->assertDatabaseHas('likes', ['id' => $like->id]);
    }

    #[Test]
    public function requires_the_current_password(): void
    {
        $this->actingAs($this->user)
            ->deleteJson($this->route, ['current_password' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password' => __('validation.account.current_password.required')]);
    }

    #[Test]
    public function refuses_a_wrong_current_password(): void
    {
        $this->actingAs($this->user)
            ->deleteJson($this->route, ['current_password' => 'wrong-password'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password' => __('validation.account.current_password.current_password')]);

        $this->assertFalse($this->user->refresh()->isDeleted());
    }
}
