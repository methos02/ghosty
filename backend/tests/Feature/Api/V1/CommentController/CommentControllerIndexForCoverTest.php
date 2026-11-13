<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Http\Controllers\Api\V1\CommentController;
use App\Models\Comment;
use App\Models\NovelCover;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentControllerIndexForCoverTest extends TestCase
{
    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CommentController::class.'@indexForCover');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'can:view,cover'], $route->gatherMiddleware());
    }

    #[Test]
    public function lists_the_comments_of_the_cover_only(): void
    {
        $cover = NovelCover::factory()->create();
        $comment = Comment::factory()->on($cover)->create();
        Comment::factory()->on(NovelCover::factory()->create())->create();

        $this->getJson("/api/v1/covers/{$cover->id}/comments")
            ->assertOk()
            ->assertJsonPath('comments.*.id', [$comment->id])
            ->assertJsonPath('meta.total', 1);
    }

    #[Test]
    public function answers_not_found_for_a_cover_hidden_by_moderation(): void
    {
        $hidden = NovelCover::factory()->hidden()->create();

        $this->getJson("/api/v1/covers/{$hidden->id}/comments")->assertNotFound();
    }
}
