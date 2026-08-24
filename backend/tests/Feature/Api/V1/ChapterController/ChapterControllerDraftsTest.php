<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Http\Controllers\Api\V1\ChapterController;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerDraftsTest extends TestCase
{
    private string $route = '/api/v1/me/drafts';

    private User $author;

    protected function setUp(): void
    {
        parent::setUp();

        $this->author = User::factory()->create();
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ChapterController::class.'@drafts');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->getJson($this->route)->assertUnauthorized();
    }

    #[Test]
    public function returns_the_drafts_of_the_author_with_their_novel(): void
    {
        $novel = Novel::factory()->create(['title' => 'Nuit virage']);
        $draft = Chapter::factory()->draft()->create([
            'author_id' => $this->author->id,
            'novel_id' => $novel->id,
            'title' => 'Le virage',
        ]);

        $response = $this->actingAs($this->author)->getJson($this->route);

        $response->assertOk()
            ->assertJsonPath('chapters.0.id', $draft->id)
            ->assertJsonPath('chapters.0.title', 'Le virage')
            ->assertJsonPath('chapters.0.is_draft', true)
            ->assertJsonPath('chapters.0.is_root', true)
            ->assertJsonPath('chapters.0.novel.title', 'Nuit virage');
    }

    #[Test]
    public function ignores_published_chapters(): void
    {
        Chapter::factory()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonCount(0, 'chapters');
    }

    #[Test]
    public function ignores_the_drafts_of_other_authors(): void
    {
        Chapter::factory()->draft()->create();

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonCount(0, 'chapters');
    }

    #[Test]
    public function keeps_a_draft_novel_out_of_the_public_list(): void
    {
        $novel = Novel::factory()->create();
        Chapter::factory()->draft()->create(['novel_id' => $novel->id, 'author_id' => $this->author->id]);

        $this->getJson('/api/v1/novels')
            ->assertOk()
            ->assertJsonCount(0, 'novels');
    }

    #[Test]
    public function leaves_the_full_text_out_of_the_draft_list(): void
    {
        Chapter::factory()->draft()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->getJson($this->route)
            ->assertOk()
            ->assertJsonPath('chapters.0.title', fn ($title) => $title !== null)
            ->assertJsonMissingPath('chapters.0.content');
    }

    #[Test]
    public function narrows_the_list_to_the_drafts_continuing_one_chapter(): void
    {
        $parent = Chapter::factory()->create();
        $wanted = Chapter::factory()->draft()->create([
            'author_id' => $this->author->id,
            'novel_id' => $parent->novel_id,
            'parent_id' => $parent->id,
        ]);
        Chapter::factory()->draft()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->getJson($this->route.'?parent_id='.$parent->id)
            ->assertOk()
            ->assertJsonCount(1, 'chapters')
            ->assertJsonPath('chapters.0.id', $wanted->id);
    }

    #[Test]
    public function ignores_the_draft_of_another_author_continuing_the_same_chapter(): void
    {
        $parent = Chapter::factory()->create();
        Chapter::factory()->draft()->create([
            'novel_id' => $parent->novel_id,
            'parent_id' => $parent->id,
        ]);

        $this->actingAs($this->author)
            ->getJson($this->route.'?parent_id='.$parent->id)
            ->assertOk()
            ->assertJsonCount(0, 'chapters');
    }

    #[Test]
    public function keeps_only_the_novel_drafts_when_asked_for_the_roots(): void
    {
        $root = Chapter::factory()->draft()->create(['author_id' => $this->author->id]);
        $parent = Chapter::factory()->create();
        Chapter::factory()->draft()->create([
            'author_id' => $this->author->id,
            'novel_id' => $parent->novel_id,
            'parent_id' => $parent->id,
        ]);

        $this->actingAs($this->author)
            ->getJson($this->route.'?is_root=1')
            ->assertOk()
            ->assertJsonCount(1, 'chapters')
            ->assertJsonPath('chapters.0.id', $root->id);
    }

    #[Test]
    public function keeps_only_the_children_when_the_roots_are_excluded(): void
    {
        Chapter::factory()->draft()->create(['author_id' => $this->author->id]);
        $parent = Chapter::factory()->create();
        $child = Chapter::factory()->draft()->create([
            'author_id' => $this->author->id,
            'novel_id' => $parent->novel_id,
            'parent_id' => $parent->id,
        ]);

        $this->actingAs($this->author)
            ->getJson($this->route.'?is_root=0')
            ->assertOk()
            ->assertJsonCount(1, 'chapters')
            ->assertJsonPath('chapters.0.id', $child->id);
    }
}
