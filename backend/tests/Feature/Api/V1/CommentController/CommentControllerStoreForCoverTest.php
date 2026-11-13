<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Enums\NotificationType;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Notification;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentControllerStoreForCoverTest extends TestCase
{
    /** @var array<string, mixed> */
    protected array $datas = [
        'content' => 'La lumière sur le virage est saisissante.',
        'is_spoiler' => false,
    ];

    private NovelCover $cover;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cover = NovelCover::factory()->create();
    }

    private function route(NovelCover $cover): string
    {
        return "/api/v1/covers/{$cover->id}/comments";
    }

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(CommentController::class, 'storeForCover', StoreCommentRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CommentController::class.'@storeForCover');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'throttle:comment', 'can:create,App\Models\Comment,cover'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route($this->cover), $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function comments_the_cover_and_counts_it(): void
    {
        $reader = User::factory()->create();

        $this->actingAs($reader)
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertCreated()
            ->assertJsonPath('comment.content', $this->datas['content'])
            ->assertJsonPath('comment_count', 1);

        $this->assertDatabaseHas('comments', [
            'author_id' => $reader->id,
            'commentable_type' => 'novel_cover',
            'commentable_id' => $this->cover->id,
        ]);
        $this->assertDatabaseHas('novel_covers', [
            'id' => $this->cover->id,
            'comment_count' => 1,
        ]);
    }

    #[Test]
    public function notifies_the_illustrator_with_the_cover(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertCreated();

        $notification = Notification::query()
            ->where('notifiable_id', $this->cover->author_id)
            ->where('type', NotificationType::CommentReceived->value)
            ->sole();
        $this->assertSame($this->cover->id, data_get($notification->data, 'cover.id'));
        $this->assertNull($notification->data['chapter']);
        $this->assertSame($this->cover->novel->slug, data_get($notification->data, 'novel.slug'));
    }

    #[Test]
    public function refuses_a_comment_banned_reader(): void
    {
        $this->actingAs(User::factory()->banned(SanctionType::CommentBan)->create())
            ->postJson($this->route($this->cover), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_cover_hidden_by_moderation(): void
    {
        $hidden = NovelCover::factory()->hidden()->create();

        $this->actingAs(User::factory()->create())
            ->postJson($this->route($hidden), $this->getDatas())
            ->assertForbidden();
    }
}
