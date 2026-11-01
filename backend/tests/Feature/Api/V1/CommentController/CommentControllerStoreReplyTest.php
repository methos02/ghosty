<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Enums\NotificationType;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentControllerStoreReplyTest extends TestCase
{
    /** @var array<string, mixed> */
    protected array $datas = [
        'content' => 'Je ne l\'avais pas vu comme ça.',
    ];

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(CommentController::class, 'storeReply', StoreCommentRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CommentController::class.'@storeReply');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:comment'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $comment = Comment::factory()->create();

        $this->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function replies_to_the_comment_on_the_same_content(): void
    {
        $reader = User::factory()->create();
        $comment = Comment::factory()->create();

        $this->actingAs($reader)
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas())
            ->assertCreated()
            ->assertJsonPath('parent_id', $comment->id)
            ->assertJsonPath('author.username', $reader->username);

        $this->assertDatabaseHas('comments', [
            'parent_id' => $comment->id,
            'commentable_type' => $comment->commentable_type,
            'commentable_id' => $comment->commentable_id,
        ]);
    }

    #[Test]
    public function counts_the_reply_on_the_comment_and_on_the_content(): void
    {
        $chapter = Chapter::factory()->create();
        $comment = Comment::factory()->on($chapter)->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas())
            ->assertCreated();

        $this->assertSame(1, $comment->refresh()->reply_count);
        $this->assertSame(2, $chapter->refresh()->comment_count);
    }

    #[Test]
    public function notifies_the_author_of_the_comment_only(): void
    {
        $chapter = Chapter::factory()->create();
        $comment = Comment::factory()->on($chapter)->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas())
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $comment->author_id,
            'type' => NotificationType::CommentReplied->value,
        ]);
        $this->assertDatabaseCount('notifications', 1);
    }

    #[Test]
    public function refuses_to_reply_to_a_reply(): void
    {
        $reply = Comment::factory()->replyingTo(Comment::factory()->create())->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$reply->id}/replies", $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function refuses_to_reply_to_a_deleted_comment(): void
    {
        $deleted = Comment::factory()->deleted()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$deleted->id}/replies", $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_banned_user(): void
    {
        $comment = Comment::factory()->create();

        $this->actingAs(User::factory()->banned()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function answers_not_found_for_an_unknown_comment(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/v1/comments/999/replies', $this->getDatas())
            ->assertNotFound();
    }
}
