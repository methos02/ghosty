<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Models\Chapter;
use App\Models\Novel;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerTreeTest extends TestCase
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
    public function returns_every_reality_of_the_novel(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $supported = Chapter::factory()->continuing($root)->liked(9)->create();
        $alternative = Chapter::factory()->continuing($root)->liked(2)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $supported->id, $alternative->id]);
    }

    #[Test]
    public function ignores_the_chapters_of_another_novel(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()->assertJsonPath('chapters.*.id', [$root->id]);
    }

    #[Test]
    public function excludes_the_drafts(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->draft()->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()->assertJsonPath('chapters.*.id', [$root->id]);
    }

    #[Test]
    public function excludes_the_chapters_hidden_by_moderation(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->hidden()->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()->assertJsonPath('chapters.*.id', [$root->id]);
    }

    #[Test]
    public function designates_the_chapters_of_the_current_branch(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $supported = Chapter::factory()->continuing($root)->liked(9)->create();
        Chapter::factory()->continuing($root)->liked(2)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()
            ->assertJsonPath('current_branch_ids', [$root->id, $supported->id]);
    }

    #[Test]
    public function follows_the_current_branch_to_its_end(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $supported = Chapter::factory()->continuing($root)->liked(9)->create();
        $end = Chapter::factory()->continuing($supported->refresh())->liked(9)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $supported->id, $end->id]);
    }

    #[Test]
    public function leaves_the_depths_of_the_discarded_branches_out(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $supported = Chapter::factory()->continuing($root)->liked(9)->create();
        $discarded = Chapter::factory()->continuing($root)->liked(2)->create();
        Chapter::factory()->continuing($discarded->refresh())->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$root->id, $supported->id, $discarded->id]);
    }

    #[Test]
    public function opens_on_the_branch_of_the_chapter_it_is_given(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $supported = Chapter::factory()->continuing($root)->liked(9)->create();
        $discarded = Chapter::factory()->continuing($root)->liked(2)->create();
        $deeper = Chapter::factory()->continuing($discarded->refresh())->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree?from={$deeper->id}");

        $response->assertOk()->assertJsonPath(
            'chapters.*.id',
            [$root->id, $supported->id, $discarded->id, $deeper->id]
        );
    }

    #[Test]
    public function keeps_designating_the_current_branch_from_another_branch(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $supported = Chapter::factory()->continuing($root)->liked(9)->create();
        $discarded = Chapter::factory()->continuing($root)->liked(2)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree?from={$discarded->id}");

        $response->assertOk()
            ->assertJsonPath('current_branch_ids', [$root->id, $supported->id]);
    }

    #[Test]
    public function returns_not_found_when_the_origin_belongs_to_another_novel(): void
    {
        [$novel] = $this->novelWithRoot();
        $foreign = Chapter::factory()->create();

        $this->getJson("/api/v1/novels/{$novel->slug}/tree?from={$foreign->id}")->assertNotFound();
    }

    #[Test]
    public function omits_the_full_text_of_the_chapters(): void
    {
        [$novel] = $this->novelWithRoot();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()->assertJsonMissingPath('chapters.0.content');
    }

    #[Test]
    public function returns_an_empty_tree_for_a_novel_without_published_chapter(): void
    {
        $novel = Novel::factory()->create(['slug' => 'roman-vide']);

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/tree");

        $response->assertOk()
            ->assertJsonCount(0, 'chapters')
            ->assertJsonPath('current_branch_ids', []);
    }
}
