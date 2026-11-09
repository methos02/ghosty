<?php

namespace Tests\Feature\Api\V1\ChapterReadController;

use App\Http\Controllers\Api\V1\ChapterReadController;
use App\Http\Requests\StoreChapterReadRequest;
use App\Models\Chapter;
use App\Models\ReadingProgress;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterReadControllerStoreTest extends TestCase
{
    /** @var array<string, mixed> */
    protected array $datas = [
        'session_key' => '2b1f0c8e-5d3a-4f6b-9a7c-1e2d3c4b5a69',
    ];

    #[Test]
    public function uses_the_form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(ChapterReadController::class, 'store', StoreChapterReadRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ChapterReadController::class.'@store');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(
            ['api', 'throttle:chapter-read', 'can:view,chapter'],
            $route->gatherMiddleware()
        );
    }

    #[Test]
    public function a_guest_read_counts_once_for_the_chapter(): void
    {
        $chapter = Chapter::factory()->create();

        $this->postJson("/api/v1/chapters/{$chapter->id}/read", $this->getDatas())->assertNoContent();

        $this->assertSame(1, $chapter->refresh()->read_count);
        $this->assertDatabaseHas('chapter_reads', [
            'chapter_id' => $chapter->id,
            'user_id' => null,
            'session_key' => $this->datas['session_key'],
        ]);
    }

    #[Test]
    public function reading_again_in_the_same_session_does_not_count_twice(): void
    {
        $chapter = Chapter::factory()->create();

        $this->postJson("/api/v1/chapters/{$chapter->id}/read", $this->getDatas())->assertNoContent();
        $this->postJson("/api/v1/chapters/{$chapter->id}/read", $this->getDatas())->assertNoContent();

        $this->assertSame(1, $chapter->refresh()->read_count);
    }

    #[Test]
    public function a_reader_counts_once_across_devices(): void
    {
        $reader = User::factory()->create();
        $chapter = Chapter::factory()->create();

        $this->actingAs($reader)->postJson("/api/v1/chapters/{$chapter->id}/read", $this->getDatas())->assertNoContent();
        $this->actingAs($reader)->postJson(
            "/api/v1/chapters/{$chapter->id}/read",
            $this->getDatas(['session_key' => '7c9e6679-7425-40de-944b-e07fc1f90ae7'])
        )->assertNoContent();

        $this->assertSame(1, $chapter->refresh()->read_count);
    }

    #[Test]
    public function counting_a_read_leaves_the_chapter_activity_date_untouched(): void
    {
        $chapter = Chapter::factory()->create(['updated_at' => now()->subDay()]);
        $activityDate = $chapter->refresh()->updated_at;

        $this->postJson("/api/v1/chapters/{$chapter->id}/read", $this->getDatas())->assertNoContent();

        $this->assertEquals($activityDate, $chapter->refresh()->updated_at);
    }

    #[Test]
    public function a_reader_resumes_the_novel_at_the_last_chapter_read(): void
    {
        $reader = User::factory()->create();
        $root = Chapter::factory()->create();
        $next = Chapter::factory()->continuing($root->refresh())->create();

        $this->actingAs($reader)->postJson("/api/v1/chapters/{$root->id}/read", $this->getDatas())->assertNoContent();
        $this->actingAs($reader)->postJson("/api/v1/chapters/{$next->id}/read", $this->getDatas())->assertNoContent();

        $progress = ReadingProgress::query()
            ->where('user_id', $reader->id)
            ->sole();
        $this->assertSame($root->novel_id, $progress->novel_id);
        $this->assertSame($next->id, $progress->chapter_id);
    }

    #[Test]
    public function a_guest_read_keeps_no_reading_progress(): void
    {
        $chapter = Chapter::factory()->create();

        $this->postJson("/api/v1/chapters/{$chapter->id}/read", $this->getDatas())->assertNoContent();

        $this->assertDatabaseCount('reading_progress', 0);
    }

    #[Test]
    public function the_author_reading_their_draft_counts_nothing(): void
    {
        $draft = Chapter::factory()->draft()->create();

        $this->actingAs($draft->author)
            ->postJson("/api/v1/chapters/{$draft->id}/read", $this->getDatas())
            ->assertNoContent();

        $this->assertDatabaseCount('chapter_reads', 0);
        $this->assertDatabaseCount('reading_progress', 0);
    }

    #[Test]
    public function hides_the_draft_of_somebody_else(): void
    {
        $draft = Chapter::factory()->draft()->create();

        $this->postJson("/api/v1/chapters/{$draft->id}/read", $this->getDatas())->assertNotFound();
    }

    #[Test]
    public function session_key_is_required(): void
    {
        $chapter = Chapter::factory()->create();

        $this->postJson("/api/v1/chapters/{$chapter->id}/read", $this->getDatas(['session_key' => '']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['session_key' => __('validation.chapter_read.session_key.required')]);
    }

    #[Test]
    public function session_key_must_be_a_uuid(): void
    {
        $chapter = Chapter::factory()->create();

        $this->postJson("/api/v1/chapters/{$chapter->id}/read", $this->getDatas(['session_key' => 'not-a-uuid']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['session_key' => __('validation.chapter_read.session_key.uuid')]);
    }
}
