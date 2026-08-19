<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Http\Controllers\Api\V1\ChapterController;
use App\Http\Requests\StoreChapterRequest;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerStoreTest extends TestCase
{
    protected array $datas = [
        'title' => 'La route inverse',
        'summary' => 'La voiture repart en sens inverse.',
    ];

    private Novel $novel;

    private Chapter $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->novel = Novel::factory()->create(['chapter_count' => 1]);
        $this->root = Chapter::factory()->create(['novel_id' => $this->novel->id]);
        $this->datas['parent_id'] = $this->root->id;
        $this->datas['content'] = str_repeat('La voiture repartit en sens inverse, phares éteints, vers le village. ', 4);
    }

    private function route(?Novel $novel = null): string
    {
        return '/api/v1/novels/'.($novel ?? $this->novel)->slug.'/chapters';
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(ChapterController::class, 'store', StoreChapterRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ChapterController::class.'@store');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->postJson($this->route(), $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function publishes_the_continuation_under_its_parent(): void
    {
        $author = User::factory()->create();

        $response = $this->actingAs($author)->postJson($this->route(), $this->getDatas());

        $response->assertCreated()
            ->assertJsonPath('parent_id', $this->root->id)
            ->assertJsonPath('depth', 1)
            ->assertJsonPath('title', 'La route inverse')
            ->assertJsonPath('author.username', $author->username);

        $chapter = Chapter::whereKey($response->json('id'))->firstOrFail();

        $this->assertSame("{$this->root->path}{$chapter->id}/", $chapter->path);
        $this->assertSame([$this->root->id], $chapter->ancestorIds());
    }

    #[Test]
    public function turns_the_continued_chapter_into_a_branch(): void
    {
        $this->actingAs(User::factory()->create())->postJson($this->route(), $this->getDatas());

        $this->assertSame(1, $this->root->refresh()->continuations_count);
        $this->assertSame(2, $this->novel->refresh()->chapter_count);
    }

    #[Test]
    public function keeps_both_continuations_of_the_same_chapter(): void
    {
        $this->actingAs(User::factory()->create())->postJson($this->route(), $this->getDatas());
        $this->actingAs(User::factory()->create())
            ->postJson($this->route(), $this->getDatas(['title' => 'La route du haut']))
            ->assertCreated();

        $this->assertSame(2, $this->root->refresh()->continuations_count);
        $this->assertSame(2, Chapter::where('parent_id', $this->root->id)->count());
    }

    #[Test]
    public function refuses_to_continue_a_chapter_withdrawn_by_moderation(): void
    {
        $hidden = Chapter::factory()->hidden()->create(['novel_id' => $this->novel->id]);

        $this->actingAs(User::factory()->create())
            ->postJson($this->route(), $this->getDatas(['parent_id' => $hidden->id]))
            ->assertForbidden();
    }

    #[Test]
    public function refuses_a_banned_author(): void
    {
        $this->actingAs(User::factory()->banned()->create())
            ->postJson($this->route(), $this->getDatas())
            ->assertForbidden();

        $this->assertSame(0, $this->root->refresh()->continuations_count);
    }

    #[Test]
    public function returns_not_found_when_the_parent_belongs_to_another_novel(): void
    {
        $otherNovel = Novel::factory()->create();

        $this->actingAs(User::factory()->create())
            ->postJson($this->route($otherNovel), $this->getDatas())
            ->assertNotFound();
    }

    #[Test]
    public function parent_is_required(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route(), $this->getDatas(['parent_id' => null]))
            ->assertJsonValidationErrors(['parent_id']);
    }

    #[Test]
    public function accepts_a_continuation_of_a_few_words(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson($this->route(), $this->getDatas(['content' => 'Il pleut.']))
            ->assertCreated();

        $this->assertSame(1, $this->root->refresh()->continuations_count);
    }
}
