<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Enums\NotificationType;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Chapter;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentControllerStoreForChapterTest extends TestCase
{
    /** @var array<string, mixed> */
    protected array $datas = [
        'content' => 'Ce virage me donne encore des frissons.',
        'is_spoiler' => false,
    ];

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(CommentController::class, 'storeForChapter', StoreCommentRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(CommentController::class.'@storeForChapter');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum', 'throttle:comment'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $chapter = Chapter::factory()->create();

        $this->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function comments_the_chapter(): void
    {
        $reader = User::factory()->create();
        $chapter = Chapter::factory()->create();

        $this->actingAs($reader)
            ->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas(['is_spoiler' => true]))
            ->assertCreated()
            ->assertJsonPath('content', $this->datas['content'])
            ->assertJsonPath('is_spoiler', true)
            ->assertJsonPath('author.username', $reader->username);

        $this->assertDatabaseHas('comments', [
            'author_id' => $reader->id,
            'commentable_type' => 'chapter',
            'commentable_id' => $chapter->id,
            'parent_id' => null,
        ]);
    }

    #[Test]
    public function counts_the_comment_on_the_chapter(): void
    {
        $chapter = Chapter::factory()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas())
            ->assertCreated();

        $this->assertSame(1, $chapter->refresh()->comment_count);
    }

    #[Test]
    public function counting_a_comment_leaves_the_chapter_activity_date_untouched(): void
    {
        $chapter = Chapter::factory()->create(['updated_at' => now()->subDay()]);
        $activityDate = $chapter->refresh()->updated_at;

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas())
            ->assertCreated();

        $this->assertEquals($activityDate, $chapter->refresh()->updated_at);
    }

    #[Test]
    public function notifies_the_author_of_the_chapter(): void
    {
        $chapter = Chapter::factory()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas())
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $chapter->author_id,
            'type' => NotificationType::CommentReceived->value,
        ]);
    }

    #[Test]
    public function refuses_to_comment_a_draft(): void
    {
        $draft = Chapter::factory()->draft()->create();

        $this->actingAs($draft->author)
            ->postJson("/api/v1/chapters/{$draft->id}/comments", $this->getDatas())
            ->assertForbidden();

        $this->assertDatabaseCount('comments', 0);
    }

    #[Test]
    public function refuses_a_banned_user(): void
    {
        $chapter = Chapter::factory()->create();

        $this->actingAs(User::factory()->banned()->create())
            ->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function content_is_required(): void
    {
        $chapter = Chapter::factory()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas(['content' => '']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['content' => __('validation.comment.content.required')]);
    }

    #[Test]
    public function content_has_a_maximum_length(): void
    {
        $chapter = Chapter::factory()->create();
        $maxLength = Config::integer('ghosty.comments.content_max_length');

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas(['content' => str_repeat('a', $maxLength + 1)]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['content' => __('validation.comment.content.max', ['max' => $maxLength])]);
    }

    #[Test]
    public function is_spoiler_must_be_a_boolean(): void
    {
        $chapter = Chapter::factory()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/chapters/{$chapter->id}/comments", $this->getDatas(['is_spoiler' => 'peut-être']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['is_spoiler' => __('validation.comment.is_spoiler.boolean')]);
    }
}
