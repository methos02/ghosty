<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerReadingTest extends TestCase
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
    public function returns_the_chapter_with_its_full_text(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $chapter = Chapter::factory()->create([
            'novel_id' => $novel->id,
            'title' => 'Le virage',
            'content' => 'La voiture avait quitte la route au troisieme virage.',
        ]);

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$chapter->id}");

        $response->assertOk()
            ->assertJsonPath('chapter.id', $chapter->id)
            ->assertJsonPath('chapter.title', 'Le virage')
            ->assertJsonPath('chapter.content', 'La voiture avait quitte la route au troisieme virage.');
    }

    #[Test]
    public function carries_the_novel_the_chapter_belongs_to(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage', 'title' => 'Nuit virage']);
        $chapter = Chapter::factory()->create(['novel_id' => $novel->id]);

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$chapter->id}");

        $response->assertOk()
            ->assertJsonPath('novel.slug', 'nuit-virage')
            ->assertJsonPath('novel.title', 'Nuit virage');
    }

    #[Test]
    public function lists_the_ancestors_from_the_root_down_to_the_parent(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $second = Chapter::factory()->continuing($root)->create();
        $third = Chapter::factory()->continuing($second->refresh())->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$third->id}");

        $response->assertOk()
            ->assertJsonPath('ancestors.*.id', [$root->id, $second->id]);
    }

    #[Test]
    public function a_root_chapter_has_no_ancestor(): void
    {
        [$novel, $root] = $this->novelWithRoot();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$root->id}");

        $response->assertOk()->assertJsonCount(0, 'ancestors');
    }

    #[Test]
    public function lists_the_children_most_supported_first(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $modest = Chapter::factory()->continuing($root)->liked(2)->create();
        $supported = Chapter::factory()->continuing($root)->liked(9)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$root->id}");

        $response->assertOk()
            ->assertJsonPath('children.*.id', [$supported->id, $modest->id]);
    }

    #[Test]
    public function omits_the_full_text_from_the_children(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$root->id}");

        $response->assertOk()->assertJsonMissingPath('children.0.content');
    }

    #[Test]
    public function excludes_the_drafts_from_the_children(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->draft()->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$root->id}");

        $response->assertOk()->assertJsonCount(0, 'children');
    }

    #[Test]
    public function the_next_chapter_is_the_one_leading_to_the_strongest_branch(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->liked(25)->create();
        $modest = Chapter::factory()->continuing($root)->liked(20)->create();
        Chapter::factory()->continuing($modest->refresh())->liked(100)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$root->id}");

        $response->assertOk()->assertJsonPath('next_chapter_id', $modest->id);
    }

    #[Test]
    public function a_branch_end_has_no_next_chapter(): void
    {
        [$novel, $root] = $this->novelWithRoot();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$root->id}");

        $response->assertOk()->assertJsonPath('next_chapter_id', null);
    }

    #[Test]
    public function reading_stops_where_moderation_broke_the_branch(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $withdrawn = Chapter::factory()->continuing($root)->liked(10)->hidden()->create();
        Chapter::factory()->continuing($withdrawn->refresh())->liked(100)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$root->id}");

        $response->assertOk()->assertJsonPath('next_chapter_id', null);
    }

    #[Test]
    public function carries_the_whole_reading_chain_that_runs_through_the_chapter(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $second = Chapter::factory()->continuing($root)->liked(5)->create();
        $third = Chapter::factory()->continuing($second->refresh())->liked(5)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$second->id}");

        $response->assertOk()
            ->assertJsonPath('branch_chapter_ids', [$root->id, $second->id, $third->id]);
    }

    #[Test]
    public function tells_the_reader_the_chain_is_the_current_branch(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $supported = Chapter::factory()->continuing($root)->liked(25)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$supported->id}");

        $response->assertOk()->assertJsonPath('is_current_branch', true);
    }

    #[Test]
    public function tells_the_reader_the_chain_left_the_current_branch(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->liked(25)->create();
        $discarded = Chapter::factory()->continuing($root)->liked(2)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$discarded->id}");

        $response->assertOk()->assertJsonPath('is_current_branch', false);
    }

    #[Test]
    public function the_chain_follows_the_strongest_branch_of_the_subtree(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        Chapter::factory()->continuing($root)->liked(25)->create();
        $modest = Chapter::factory()->continuing($root)->liked(20)->create();
        $payoff = Chapter::factory()->continuing($modest->refresh())->liked(100)->create();

        $response = $this->getJson("/api/v1/novels/{$novel->slug}/chapters/{$root->id}");

        $response->assertOk()
            ->assertJsonPath('branch_chapter_ids', [$root->id, $modest->id, $payoff->id]);
    }

    #[Test]
    public function a_draft_stands_alone_outside_any_reading_chain(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $author = User::factory()->create();
        $draft = Chapter::factory()->continuing($root)->draft()->create(['author_id' => $author->id]);

        $response = $this->actingAs($author)
            ->getJson("/api/v1/novels/{$novel->slug}/chapters/{$draft->id}");

        $response->assertOk()
            ->assertJsonPath('branch_chapter_ids', [$draft->id]);
    }

    #[Test]
    public function returns_not_found_when_the_chapter_belongs_to_another_novel(): void
    {
        Novel::factory()->create(['slug' => 'nuit-virage']);
        $foreign = Chapter::factory()->create();

        $this->getJson("/api/v1/novels/nuit-virage/chapters/{$foreign->id}")->assertNotFound();
    }

    #[Test]
    public function returns_not_found_for_a_draft_of_another_author(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $draft = Chapter::factory()->continuing($root)->draft()->create();

        $this->actingAs(User::factory()->create())
            ->getJson("/api/v1/novels/{$novel->slug}/chapters/{$draft->id}")
            ->assertNotFound();
    }

    #[Test]
    public function serves_their_own_draft_to_its_author(): void
    {
        [$novel, $root] = $this->novelWithRoot();
        $author = User::factory()->create();
        $draft = Chapter::factory()->continuing($root)->draft()->create(['author_id' => $author->id]);

        $this->actingAs($author)
            ->getJson("/api/v1/novels/{$novel->slug}/chapters/{$draft->id}")
            ->assertOk()
            ->assertJsonPath('chapter.id', $draft->id);
    }
}
