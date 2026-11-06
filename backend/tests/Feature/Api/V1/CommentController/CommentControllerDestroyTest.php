<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Http\Controllers\Api\V1\CommentController;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentControllerDestroyTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CommentController::class.'@destroy');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $comment = Comment::factory()->create();

        $this->deleteJson("/api/v1/comments/{$comment->id}")->assertUnauthorized();
    }

    #[Test]
    public function the_author_erases_the_content_of_their_comment(): void
    {
        $comment = Comment::factory()->create();

        $this->actingAs($comment->author)
            ->deleteJson("/api/v1/comments/{$comment->id}")
            ->assertOk();

        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'status' => Comment::STATUS_DELETED,
            'content' => null,
        ]);
    }

    #[Test]
    public function uncounts_the_comment_on_the_content_and_serves_the_new_total(): void
    {
        $chapter = Chapter::factory()->create();
        $comment = Comment::factory()->on($chapter)->create();

        $this->actingAs($comment->author)
            ->deleteJson("/api/v1/comments/{$comment->id}")
            ->assertOk()
            ->assertJsonPath('comment_count', 0);

        $this->assertSame(0, $chapter->refresh()->comment_count);
    }

    #[Test]
    public function deleting_a_reply_uncounts_it_on_its_comment(): void
    {
        $comment = Comment::factory()->create();
        $reply = Comment::factory()->replyingTo($comment)->create();

        $this->actingAs($reply->author)
            ->deleteJson("/api/v1/comments/{$reply->id}")
            ->assertOk();

        $this->assertSame(0, $comment->refresh()->reply_count);
    }

    #[Test]
    public function refuses_to_delete_the_comment_of_somebody_else(): void
    {
        $comment = Comment::factory()->create();

        $this->actingAs(User::factory()->create())
            ->deleteJson("/api/v1/comments/{$comment->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'status' => Comment::STATUS_VISIBLE,
        ]);
    }

    #[Test]
    public function refuses_to_delete_twice(): void
    {
        $comment = Comment::factory()->deleted()->create();

        $this->actingAs($comment->author)
            ->deleteJson("/api/v1/comments/{$comment->id}")
            ->assertForbidden();
    }
}
