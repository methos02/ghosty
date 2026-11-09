<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Http\Controllers\Api\V1\ModerationController;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerRestoreCommentTest extends TestCase
{
    private User $moderator;

    private Chapter $chapter;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
        $this->chapter = Chapter::factory()->create();
    }

    private function route(Comment $comment): string
    {
        return "/api/v1/moderation/comments/{$comment->id}/restore";
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@restoreComment');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report', 'can:restore,comment'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $hidden = Comment::factory()->on($this->chapter)->hidden()->create();

        $this->postJson($this->route($hidden))->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $hidden = Comment::factory()->on($this->chapter)->hidden()->create();

        $this->actingAs(User::factory()->create())
            ->postJson($this->route($hidden))
            ->assertForbidden();
    }

    #[Test]
    public function restores_a_hidden_comment_and_its_counters(): void
    {
        $parent = Comment::factory()->on($this->chapter)->create();
        $hiddenReply = Comment::factory()->replyingTo($parent)->hidden()->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($hiddenReply))
            ->assertOk();

        $this->assertDatabaseHas('comments', ['id' => $hiddenReply->id, 'status' => Comment::STATUS_VISIBLE]);
        $this->assertDatabaseHas('comments', ['id' => $parent->id, 'reply_count' => 1]);
        $this->assertDatabaseHas('chapters', ['id' => $this->chapter->id, 'comment_count' => 2]);
    }

    #[Test]
    public function refuses_a_visible_comment(): void
    {
        $visible = Comment::factory()->on($this->chapter)->create();

        $this->actingAs($this->moderator)
            ->postJson($this->route($visible))
            ->assertForbidden();
    }
}
