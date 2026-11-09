<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Http\Controllers\Api\V1\CommentController;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentControllerIndexForChapterTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CommentController::class.'@indexForChapter');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'can:view,chapter'], $route->gatherMiddleware());
    }

    #[Test]
    public function lists_the_comments_of_the_chapter_most_recent_first(): void
    {
        $chapter = Chapter::factory()->create();
        $older = Comment::factory()->on($chapter)->create(['created_at' => now()->subHour()]);
        $newer = Comment::factory()->on($chapter)->create();
        Comment::factory()->create();

        $this->getJson("/api/v1/chapters/{$chapter->id}/comments")
            ->assertOk()
            ->assertJsonPath('comments.*.id', [$newer->id, $older->id])
            ->assertJsonPath('comments.0.author.username', $newer->author->username)
            ->assertJsonPath('comments.0.content', $newer->content)
            ->assertJsonPath('meta.total', 2);
    }

    #[Test]
    public function nests_the_replies_under_their_comment_in_chronological_order(): void
    {
        $comment = Comment::factory()->create();
        $first = Comment::factory()->replyingTo($comment)->create(['created_at' => now()->subMinute()]);
        $second = Comment::factory()->replyingTo($comment)->create();

        $this->getJson("/api/v1/chapters/{$comment->commentable_id}/comments")
            ->assertOk()
            ->assertJsonCount(1, 'comments')
            ->assertJsonPath('comments.0.reply_count', 2)
            ->assertJsonPath('comments.0.replies.*.id', [$first->id, $second->id]);
    }

    #[Test]
    public function keeps_a_deleted_comment_with_replies_as_an_anonymous_trace(): void
    {
        $deleted = Comment::factory()->deleted()->create();
        Comment::factory()->replyingTo($deleted)->create();

        $this->getJson("/api/v1/chapters/{$deleted->commentable_id}/comments")
            ->assertOk()
            ->assertJsonPath('comments.0.id', $deleted->id)
            ->assertJsonPath('comments.0.is_deleted', true)
            ->assertJsonPath('comments.0.content', null)
            ->assertJsonPath('comments.0.author', null);
    }

    #[Test]
    public function keeps_a_hidden_comment_with_replies_as_an_anonymous_trace(): void
    {
        $hidden = Comment::factory()->hidden()->create();
        $reply = Comment::factory()->replyingTo($hidden)->create();

        $this->getJson("/api/v1/chapters/{$hidden->commentable_id}/comments")
            ->assertOk()
            ->assertJsonPath('comments.0.id', $hidden->id)
            ->assertJsonPath('comments.0.is_hidden', true)
            ->assertJsonPath('comments.0.content', null)
            ->assertJsonPath('comments.0.author', null)
            ->assertJsonPath('comments.0.replies.*.id', [$reply->id]);
    }

    #[Test]
    public function leaves_out_a_hidden_comment_without_replies(): void
    {
        $hidden = Comment::factory()->hidden()->create();

        $this->getJson("/api/v1/chapters/{$hidden->commentable_id}/comments")
            ->assertOk()
            ->assertJsonCount(0, 'comments');
    }

    #[Test]
    public function leaves_out_a_hidden_reply(): void
    {
        $comment = Comment::factory()->create();
        Comment::factory()->replyingTo($comment)->hidden()->create();

        $this->getJson("/api/v1/chapters/{$comment->commentable_id}/comments")
            ->assertOk()
            ->assertJsonCount(0, 'comments.0.replies');
    }

    #[Test]
    public function flags_the_comments_reported_by_the_reader(): void
    {
        $reader = User::factory()->create();
        $comment = Comment::factory()->create();
        $reply = Comment::factory()->replyingTo($comment)->create();
        Comment::factory()->replyingTo($comment)->create();
        Report::factory()->on($comment)->create(['reporter_id' => $reader->id]);
        Report::factory()->on($reply)->create(['reporter_id' => $reader->id]);

        $this->actingAs($reader)
            ->getJson("/api/v1/chapters/{$comment->commentable_id}/comments")
            ->assertOk()
            ->assertJsonPath('comments.0.is_reported', true)
            ->assertJsonPath('comments.0.replies.*.is_reported', [true, false]);
    }

    #[Test]
    public function does_not_flag_a_comment_reported_by_someone_else(): void
    {
        $comment = Comment::factory()->create();
        Report::factory()->on($comment)->create();

        $this->actingAs(User::factory()->create())
            ->getJson("/api/v1/chapters/{$comment->commentable_id}/comments")
            ->assertOk()
            ->assertJsonPath('comments.0.is_reported', false);
    }

    #[Test]
    public function leaves_out_a_deleted_comment_without_replies(): void
    {
        $deleted = Comment::factory()->deleted()->create();

        $this->getJson("/api/v1/chapters/{$deleted->commentable_id}/comments")
            ->assertOk()
            ->assertJsonCount(0, 'comments');
    }

    #[Test]
    public function leaves_out_a_deleted_reply(): void
    {
        $comment = Comment::factory()->create();
        Comment::factory()->replyingTo($comment)->deleted()->create();

        $this->getJson("/api/v1/chapters/{$comment->commentable_id}/comments")
            ->assertOk()
            ->assertJsonCount(0, 'comments.0.replies');
    }

    #[Test]
    public function serves_the_content_of_a_spoiler_with_its_flag(): void
    {
        $spoiler = Comment::factory()->spoiler()->create();

        $this->getJson("/api/v1/chapters/{$spoiler->commentable_id}/comments")
            ->assertOk()
            ->assertJsonPath('comments.0.is_spoiler', true)
            ->assertJsonPath('comments.0.content', $spoiler->content);
    }

    #[Test]
    public function hides_the_comments_of_somebody_elses_draft(): void
    {
        $draft = Chapter::factory()->draft()->create();

        $this->getJson("/api/v1/chapters/{$draft->id}/comments")->assertNotFound();
    }
}
