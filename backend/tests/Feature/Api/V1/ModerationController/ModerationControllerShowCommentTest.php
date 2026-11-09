<?php

namespace Tests\Feature\Api\V1\ModerationController;

use App\Enums\ReportReason;
use App\Enums\SanctionType;
use App\Http\Controllers\Api\V1\ModerationController;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Report;
use App\Models\Sanction;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ModerationControllerShowCommentTest extends TestCase
{
    private User $moderator;

    private Comment $comment;

    protected function setUp(): void
    {
        parent::setUp();

        $this->moderator = User::factory()->moderator()->create();
        $author = User::factory()->create(['username' => 'troll']);
        $chapter = Chapter::factory()->create(['title' => 'Le virage']);
        $this->comment = Comment::factory()->on($chapter)->by($author)->create(['content' => 'Propos injurieux']);
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ModerationController::class.'@showComment');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'auth:sanctum', 'can:moderate,App\Models\Report'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson("/api/v1/moderation/comments/{$this->comment->id}")
            ->assertUnauthorized();
    }

    #[Test]
    public function refuses_a_reader(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson("/api/v1/moderation/comments/{$this->comment->id}")
            ->assertForbidden();
    }

    #[Test]
    public function serves_the_comment_with_its_target_reports_and_author_sanctions(): void
    {
        Report::factory()->on($this->comment)->create(['reason' => ReportReason::Insult->value]);
        Sanction::factory()->ofType(SanctionType::CommentBan)->create(['user_id' => $this->comment->author_id]);

        $this->actingAs($this->moderator)
            ->getJson("/api/v1/moderation/comments/{$this->comment->id}")
            ->assertOk()
            ->assertJsonPath('comment.id', $this->comment->id)
            ->assertJsonPath('comment.content', 'Propos injurieux')
            ->assertJsonPath('comment.author.username', 'troll')
            ->assertJsonPath('comment.chapter.title', 'Le virage')
            ->assertJsonCount(1, 'reports')
            ->assertJsonPath('reports.0.reason', ReportReason::Insult->value)
            ->assertJsonCount(1, 'author_sanctions')
            ->assertJsonPath('author_sanctions.0.type', SanctionType::CommentBan->value);
    }

    #[Test]
    public function still_serves_the_text_of_a_hidden_comment(): void
    {
        $hidden = Comment::factory()->hidden()->create(['content' => 'Texte masqué']);

        $this->actingAs($this->moderator)
            ->getJson("/api/v1/moderation/comments/{$hidden->id}")
            ->assertOk()
            ->assertJsonPath('comment.content', 'Texte masqué')
            ->assertJsonPath('comment.is_hidden', true);
    }
}
