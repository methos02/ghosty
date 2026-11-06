<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Enums\NotificationType;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Requests\StoreCommentReplyRequest;
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
        $this->assertTrue($this->hasFormRequest(CommentController::class, 'storeReply', StoreCommentReplyRequest::class));
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
            ->assertJsonPath('comment.parent_id', $comment->id)
            ->assertJsonPath('comment.author.username', $reader->username)
            ->assertJsonPath('comment_count', $comment->target()->refresh()->comment_count);

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
    public function notifies_the_mentioned_reader_of_the_thread_too(): void
    {
        $comment = Comment::factory()->on(Chapter::factory()->create())->create();
        $mentionedReply = Comment::factory()->replyingTo($comment)->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas([
                'content' => "@{$mentionedReply->author->username} Tout à fait.",
                'mentioned_user_id' => $mentionedReply->author_id,
            ]))
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $mentionedReply->author_id,
            'type' => NotificationType::CommentReplied->value,
        ]);
        $this->assertDatabaseCount('notifications', 2);
    }

    #[Test]
    public function notifies_the_mentioned_reader_whose_username_holds_a_space(): void
    {
        $comment = Comment::factory()->on(Chapter::factory()->create())->create();
        $mentioned = User::factory()->create(['username' => 'Jean Dupont']);
        Comment::factory()->replyingTo($comment)->create(['author_id' => $mentioned->id]);

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas([
                'content' => '@Jean Dupont Tout à fait.',
                'mentioned_user_id' => $mentioned->id,
            ]))
            ->assertCreated();

        $this->assertDatabaseHas('notifications', ['notifiable_id' => $mentioned->id]);
    }

    #[Test]
    public function notifies_once_the_author_of_the_comment_mentioned_in_the_reply(): void
    {
        $comment = Comment::factory()->on(Chapter::factory()->create())->create();
        Comment::factory()->replyingTo($comment)->create(['author_id' => $comment->author_id]);

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas([
                'content' => "@{$comment->author->username} Tout à fait.",
                'mentioned_user_id' => $comment->author_id,
            ]))
            ->assertCreated();

        $this->assertDatabaseCount('notifications', 1);
    }

    #[Test]
    public function ignores_a_mentioned_reader_whose_username_does_not_open_the_reply(): void
    {
        $comment = Comment::factory()->on(Chapter::factory()->create())->create();
        $reply = Comment::factory()->replyingTo($comment)->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas([
                'content' => 'Tout à fait.',
                'mentioned_user_id' => $reply->author_id,
            ]))
            ->assertCreated();

        $this->assertDatabaseMissing('notifications', ['notifiable_id' => $reply->author_id]);
    }

    #[Test]
    public function ignores_a_mention_without_the_id_of_the_mentioned_reader(): void
    {
        $comment = Comment::factory()->on(Chapter::factory()->create())->create();
        $reply = Comment::factory()->replyingTo($comment)->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas([
                'content' => "@{$reply->author->username} Tout à fait.",
            ]))
            ->assertCreated();

        $this->assertDatabaseMissing('notifications', ['notifiable_id' => $reply->author_id]);
    }

    #[Test]
    public function ignores_a_mentioned_reader_absent_from_the_thread(): void
    {
        $comment = Comment::factory()->on(Chapter::factory()->create())->create();
        $stranger = User::factory()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas([
                'content' => "@{$stranger->username} Tu as vu ça ?",
                'mentioned_user_id' => $stranger->id,
            ]))
            ->assertCreated();

        $this->assertDatabaseMissing('notifications', ['notifiable_id' => $stranger->id]);
        $this->assertDatabaseCount('notifications', 1);
    }

    #[Test]
    public function ignores_a_mentioned_reader_whose_reply_was_deleted(): void
    {
        $comment = Comment::factory()->on(Chapter::factory()->create())->create();
        $deletedReply = Comment::factory()->replyingTo($comment)->deleted()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas([
                'content' => "@{$deletedReply->author->username} Dommage.",
                'mentioned_user_id' => $deletedReply->author_id,
            ]))
            ->assertCreated();

        $this->assertDatabaseMissing('notifications', ['notifiable_id' => $deletedReply->author_id]);
    }

    #[Test]
    public function refuses_a_mentioned_reader_that_is_not_an_id(): void
    {
        $comment = Comment::factory()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/comments/{$comment->id}/replies", $this->getDatas([
                'mentioned_user_id' => 'abc',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['mentioned_user_id' => __('validation.comment.mentioned_user_id.integer')]);
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
