<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Models\Chapter;
use App\Models\Novel;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerMainContinuityTest extends TestCase
{
    /**
     * @return array{0: Novel, 1: Chapter}
     */
    private function novelWithRoot(): array
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $root = Chapter::factory()->create(['novel_id' => $novel->id]);

        return [$novel, $root];
    }

    #[Test]
    public function returns_the_root_chapter(): void
    {
        [$novel, $root] = $this->novelWithRoot();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonCount(1, 'chapters')
            ->assertJsonPath('chapters.0.id', $root->id);
    }

    #[Test]
    public function follows_the_main_continuity_in_reading_order(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $second = Chapter::factory()->continuing($root)->mainContinuity()->create();
        $third = Chapter::factory()->continuing($second)->mainContinuity()->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonCount(3, 'chapters')
            ->assertJsonPath('chapters.0.id', $root->id)
            ->assertJsonPath('chapters.1.id', $second->id)
            ->assertJsonPath('chapters.2.id', $third->id);
    }

    #[Test]
    public function excludes_alternative_realities(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $main = Chapter::factory()->continuing($root)->mainContinuity()->create();
        Chapter::factory()->continuing($root)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $main->id]);
    }

    #[Test]
    public function ignores_a_main_continuity_of_another_branch(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $mainSecond = Chapter::factory()->continuing($root)->mainContinuity()->create();
        $alternativeSecond = Chapter::factory()->continuing($root)->create();
        Chapter::factory()->continuing($alternativeSecond)->mainContinuity()->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $mainSecond->id]);
    }

    #[Test]
    public function excludes_chapters_hidden_by_moderation(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->mainContinuity()->hidden()->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id]);
    }

    #[Test]
    public function omits_the_full_text_from_the_continuity(): void
    {
        [$novel] = $this->novelWithRoot();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonMissingPath('chapters.0.content');
    }

    #[Test]
    public function returns_an_empty_list_for_a_novel_without_chapter(): void
    {
        $novel = Novel::factory()->create(['slug' => 'roman-vide']);

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()->assertJsonCount(0, 'chapters');
    }
}
