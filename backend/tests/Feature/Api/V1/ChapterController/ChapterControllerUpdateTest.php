<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Http\Controllers\Api\V1\ChapterController;
use App\Http\Requests\UpdateChapterRequest;
use App\Models\Chapter;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see backend/memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
 */
class ChapterControllerUpdateTest extends TestCase
{
    private const PUBLISHED = 'La voiture avait quiter la route au troisieme virage, phares eteints, et personne dans le village ne comprenait pourquoi elle roulait encore vers la riviere gelee sans jamais ralentir. Le pont etait ferme depuis lheure ou le brouillard avait pris le vallon, mais aucun conducteur ne semblait avoir vu la barriere, ni les feux rouges qui clignotaient au bord du fosse.';

    private const CORRECTED = 'La voiture avait quitté la route au troisième virage, phares éteints, et personne dans le village ne comprenait pourquoi elle roulait encore vers la rivière gelée sans jamais ralentir. Le pont etait ferme depuis lheure ou le brouillard avait pris le vallon, mais aucun conducteur ne semblait avoir vu la barriere, ni les feux rouges qui clignotaient au bord du fosse.';

    protected array $datas = [
        'title' => 'Le virage',
        'summary' => 'Une route de montagne, un virage manqué.',
        'content' => self::CORRECTED,
    ];

    private User $author;

    private Chapter $chapter;

    protected function setUp(): void
    {
        parent::setUp();

        $this->author = User::factory()->create();
        $this->chapter = Chapter::factory()->create([
            'author_id' => $this->author->id,
            'title' => 'Le virage',
            'summary' => 'Une route de montagne, un virage manqué.',
            'content' => self::PUBLISHED,
            'published_at' => now()->subHour(),
        ]);
    }

    private function route(): string
    {
        return "/api/v1/chapters/{$this->chapter->id}";
    }

    #[Test]
    public function form_request(): void
    {
        $this->assertTrue($this->hasFormRequest(ChapterController::class, 'update', UpdateChapterRequest::class));
    }

    #[Test]
    public function has_middleware(): void
    {
        $route = Route::getRoutes()->getByAction(ChapterController::class.'@update');
        $this->assertNotNull($route);

        $this->assertEqualsCanonicalizing(['api', 'auth:sanctum'], $route->gatherMiddleware());
    }

    #[Test]
    public function requires_authentication(): void
    {
        $this->putJson($this->route(), $this->getDatas())->assertUnauthorized();
    }

    #[Test]
    public function lets_the_author_fix_spelling_inside_the_window(): void
    {
        $response = $this->actingAs($this->author)->putJson($this->route(), $this->getDatas());

        $response->assertOk()
            ->assertJsonPath('content', self::CORRECTED);

        $this->assertSame(self::CORRECTED, $this->chapter->refresh()->content);
    }

    #[Test]
    public function fixes_spelling_even_once_the_chapter_has_been_continued(): void
    {
        Chapter::factory()->continuing($this->chapter)->create();

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas())
            ->assertOk();
    }

    #[Test]
    public function accepts_a_reworded_sentence_that_leaves_the_story_intact(): void
    {
        $reworded = str_replace('phares eteints', 'tous feux eteints', self::CORRECTED);

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['content' => $reworded]))
            ->assertOk();

        $this->assertSame($reworded, $this->chapter->refresh()->content);
    }

    #[Test]
    public function refuses_a_rewriting_that_goes_beyond_the_allowed_share(): void
    {
        $rewritten = str_repeat('Un texte entierement different. ', 20);

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['content' => $rewritten]))
            ->assertJsonValidationErrors(['content']);

        $this->assertSame(self::PUBLISHED, $this->chapter->refresh()->content);
    }

    #[Test]
    public function refuses_a_second_correction(): void
    {
        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas())
            ->assertOk();

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function records_the_moment_of_the_correction(): void
    {
        $this->assertNull($this->chapter->corrected_at);

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas())
            ->assertOk();

        $this->assertNotNull($this->chapter->refresh()->corrected_at);
    }

    #[Test]
    public function refuses_a_correction_once_the_window_has_closed(): void
    {
        $this->chapter->update(['published_at' => now()->subWeek()]);

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas())
            ->assertForbidden();

        $this->assertSame(self::PUBLISHED, $this->chapter->refresh()->content);
    }

    #[Test]
    public function refuses_a_sentence_added_to_the_published_text(): void
    {
        $extended = self::CORRECTED.' Elle ne freina jamais.';

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['content' => $extended]))
            ->assertJsonValidationErrors(['content']);
    }

    #[Test]
    public function answers_a_refused_correction_in_the_reader_language(): void
    {
        $rewritten = 'Un texte entierement different, ecrit par-dessus le precedent sans rien garder.';

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['content' => $rewritten]))
            ->assertJsonPath('errors.content.0', __('validation.chapter.correction.too_many'))
            ->assertJsonPath(
                'errors.content.0',
                fn (string $message) => ! str_starts_with($message, 'validation.')
            );
    }

    #[Test]
    public function refuses_more_corrections_than_the_window_allows(): void
    {
        $overCorrected = str_replace(
            ['etait', 'ferme', 'lheure', 'barriere', 'fosse'],
            ['était', 'fermé', 'l\'heure', 'barrière', 'fossé'],
            self::CORRECTED
        );

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['content' => $overCorrected]))
            ->assertJsonValidationErrors(['content']);
    }

    #[Test]
    public function refuses_to_drop_the_published_summary(): void
    {
        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas(['summary' => null]))
            ->assertJsonValidationErrors(['summary']);
    }

    #[Test]
    public function lets_the_author_rewrite_a_draft_freely(): void
    {
        $draft = Chapter::factory()->draft()->create(['author_id' => $this->author->id]);

        $this->actingAs($this->author)
            ->putJson("/api/v1/chapters/{$draft->id}", $this->getDatas([
                'title' => 'Tout autre chose',
                'content' => 'Un texte entièrement différent, écrit par-dessus le précédent.',
                'summary' => 'Un résumé lui aussi refait de fond en comble.',
            ]))
            ->assertOk();

        $this->assertSame('Tout autre chose', $draft->refresh()->title);
    }

    #[Test]
    public function refuses_a_correction_by_another_author(): void
    {
        $this->actingAs(User::factory()->create())
            ->putJson($this->route(), $this->getDatas())
            ->assertForbidden();
    }

    #[Test]
    public function refuses_to_touch_a_chapter_withdrawn_by_moderation(): void
    {
        $this->chapter->update(['status' => Chapter::STATUS_HIDDEN]);

        $this->actingAs($this->author)
            ->putJson($this->route(), $this->getDatas())
            ->assertForbidden();
    }
}
