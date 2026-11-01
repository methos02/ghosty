<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Enums\NotificationType;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Chapter;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentControllerStoreForNovelTest extends TestCase
{
    /** @var array<string, mixed> */
    protected array $datas = [
        'content' => 'Toutes ces versions de la même nuit, quel plaisir.',
    ];

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(CommentController::class, 'storeForNovel', StoreCommentRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CommentController::class.'@storeForNovel');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:comment'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $novel = Chapter::factory()->create()->novel;

        $this->postJson("/api/v1/novels/{$novel->slug}/comments", $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function comments_the_novel_and_counts_it(): void
    {
        $reader = User::factory()->create();
        $novel = Chapter::factory()->create()->novel;

        $this->actingAs($reader)
            ->postJson("/api/v1/novels/{$novel->slug}/comments", $this->getDatas())
            ->assertCreated()
            ->assertJsonPath('content', $this->datas['content']);

        $this->assertDatabaseHas('comments', [
            'commentable_type' => 'novel',
            'commentable_id' => $novel->id,
        ]);
        $this->assertSame(1, $novel->refresh()->comment_count);
    }

    #[Test]
    public function notifies_the_author_of_the_novel(): void
    {
        $novel = Chapter::factory()->create()->novel;

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/novels/{$novel->slug}/comments", $this->getDatas())
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $novel->author_id,
            'type' => NotificationType::CommentReceived->value,
        ]);
    }

    #[Test]
    public function refuses_to_comment_a_draft_novel(): void
    {
        $novel = Chapter::factory()->draft()->create()->novel;

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/novels/{$novel->slug}/comments", $this->getDatas())
            ->assertForbidden();
    }
}
