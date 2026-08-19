<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Http\Controllers\Api\V1\ChapterController;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerPublishTest extends TestCase
{
    private const LONG_ENOUGH = 'La voiture avait quitté la route au troisième virage, phares éteints, et personne dans le village ne comprenait pourquoi elle roulait encore vers la rivière gelée sans jamais ralentir avant le pont de pierre, ni pourquoi ses portes étaient restées ouvertes.';

    private User $author;

    private Novel $novel;

    private Chapter $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->author = User::factory()->create();
        $this->novel = Novel::factory()->create(['chapter_count' => 1]);
        $this->root = Chapter::factory()->create(['novel_id' => $this->novel->id]);
    }

    private function draft(string $content = self::LONG_ENOUGH): Chapter
    {
        return Chapter::factory()->draft()->continuing($this->root)->create([
            'author_id' => $this->author->id,
            'content' => $content,
        ]);
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ChapterController::class.'@publish');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $draft = $this->draft();

        $this->postJson("/api/v1/chapters/{$draft->id}/publish")->assertUnauthorized();
    }

    #[Test]
    public function makes_the_draft_readable_and_counts_it(): void
    {
        $draft = $this->draft();

        $response = $this->actingAs($this->author)->postJson("/api/v1/chapters/{$draft->id}/publish");

        $response->assertOk()->assertJsonPath('is_draft', false);

        $this->assertTrue($draft->refresh()->isPublished());
        $this->assertNotNull($draft->published_at);
        $this->assertSame(2, $this->novel->refresh()->chapter_count);
    }

    #[Test]
    public function turns_the_parent_into_a_branch_only_at_publication(): void
    {
        $draft = $this->draft();

        $this->assertSame(0, $this->root->refresh()->continuations_count);

        $this->actingAs($this->author)->postJson("/api/v1/chapters/{$draft->id}/publish");

        $this->assertSame(1, $this->root->refresh()->continuations_count);
    }

    #[Test]
    public function publishes_a_text_however_short_it_is(): void
    {
        $draft = $this->draft('Il pleut.');

        $this->actingAs($this->author)
            ->postJson("/api/v1/chapters/{$draft->id}/publish")
            ->assertOk();

        $this->assertTrue($draft->refresh()->isPublished());
    }

    #[Test]
    public function refuses_to_publish_the_draft_of_someone_else(): void
    {
        $draft = $this->draft();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/v1/chapters/{$draft->id}/publish")
            ->assertForbidden();
    }

    #[Test]
    public function refuses_to_publish_an_already_published_chapter(): void
    {
        $published = Chapter::factory()->continuing($this->root)->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->postJson("/api/v1/chapters/{$published->id}/publish")
            ->assertForbidden();
    }
}
