<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Models\Chapter;
use App\Models\Novel;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerCurrentBranchTest extends TestCase
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
    public function follows_the_most_supported_branch_in_reading_order(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $second = Chapter::factory()->continuing($root)->liked(10)->create();
        $third = Chapter::factory()->continuing($second)->liked(5)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $second->id, $third->id]);
    }

    #[Test]
    public function excludes_alternative_realities(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $supported = Chapter::factory()->continuing($root)->liked(10)->create();
        Chapter::factory()->continuing($root)->liked(2)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $supported->id]);
    }

    #[Test]
    public function prefers_a_branch_that_accumulates_more_than_a_better_first_chapter(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->liked(25)->create();
        $modest = Chapter::factory()->continuing($root)->liked(20)->create();
        $payoff = Chapter::factory()->continuing($modest)->liked(100)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $modest->id, $payoff->id]);
    }

    #[Test]
    public function a_dead_end_never_interrupts_the_reading(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->liked(30)->create();
        $continued = Chapter::factory()->continuing($root)->liked(1)->create();
        $suite = Chapter::factory()->continuing($continued)->liked(30)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $continued->id, $suite->id]);
    }

    #[Test]
    public function the_oldest_published_keeps_the_branch_when_support_is_equal(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $elder = Chapter::factory()->continuing($root)->liked(10)
            ->create(['published_at' => now()->subDay()]);
        Chapter::factory()->continuing($root)->liked(10)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $elder->id]);
    }

    #[Test]
    public function excludes_chapters_hidden_by_moderation(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->liked(50)->hidden()->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id]);
    }

    #[Test]
    public function stops_where_moderation_broke_the_branch(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $visible = Chapter::factory()->continuing($root)->liked(5)->create();
        $withdrawn = Chapter::factory()->continuing($visible)->liked(10)->hidden()->create();
        Chapter::factory()->continuing($withdrawn)->liked(100)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $visible->id]);
    }

    #[Test]
    public function omits_the_full_text_from_the_branch(): void
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
