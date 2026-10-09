<?php

namespace Tests\Feature\Services;

use App\DTO\ChapterDTO;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Services\BranchService;
use App\Services\ChapterService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BranchServiceTest extends TestCase
{
    private function recomputeBranchLikes(Chapter $chapter): int
    {
        return app(BranchService::class)->recomputeBranchLikes(
            Novel::findOrFail($chapter->novel_id)
        );
    }

    #[Test]
    public function a_like_raises_the_weight_of_the_chapter_and_of_everything_it_leads_to(): void
    {
        $root = Chapter::factory()->liked(4)->create();
        $second = Chapter::factory()->continuing($root)->liked(6)->create();
        $third = Chapter::factory()->continuing($second)->liked(1)->create();

        $second->increment('like_count');
        $this->recomputeBranchLikes($root);

        $this->assertSame(4, $root->refresh()->branch_like_count);
        $this->assertSame(11, $second->refresh()->branch_like_count);
        $this->assertSame(12, $third->refresh()->branch_like_count);
    }

    #[Test]
    public function a_like_leaves_alternative_realities_untouched(): void
    {
        $root = Chapter::factory()->create();
        $supported = Chapter::factory()->continuing($root)->liked(3)->create();
        $alternative = Chapter::factory()->continuing($root)->liked(3)->create();

        $supported->increment('like_count');
        $this->recomputeBranchLikes($root);

        $this->assertSame(4, $supported->refresh()->branch_like_count);
        $this->assertSame(3, $alternative->refresh()->branch_like_count);
    }

    #[Test]
    public function withdrawing_a_like_rolls_the_weight_back(): void
    {
        $root = Chapter::factory()->liked(5)->create();
        $second = Chapter::factory()->continuing($root)->create();

        $root->increment('like_count');
        $root->decrement('like_count');
        $this->recomputeBranchLikes($root);

        $this->assertSame(5, $root->refresh()->branch_like_count);
        $this->assertSame(5, $second->refresh()->branch_like_count);
    }

    #[Test]
    public function supporting_then_withdrawing_costs_no_branch_write_at_all(): void
    {
        $root = Chapter::factory()->liked(5)->create();
        Chapter::factory()->continuing($root)->create();

        $root->increment('like_count');
        $root->decrement('like_count');

        $this->assertSame(0, $this->recomputeBranchLikes($root));
    }

    #[Test]
    public function repeated_toggling_is_collapsed_into_a_single_recompute(): void
    {
        $root = Chapter::factory()->create();
        $second = Chapter::factory()->continuing($root)->create();

        $root->increment('like_count');
        $root->decrement('like_count');
        $root->increment('like_count');

        $this->assertSame(2, $this->recomputeBranchLikes($root));
        $this->assertSame(1, $second->refresh()->branch_like_count);
    }

    #[Test]
    public function a_draft_joins_the_branch_with_the_total_as_it_stands_at_publication(): void
    {
        $root = Chapter::factory()->liked(100)->create();
        $service = app(ChapterService::class);

        $draft = $service->createChild($root, User::factory()->create(), new ChapterDTO(
            title: 'La route inverse',
            content: 'La voiture repartit en sens inverse, phares éteints.',
            asDraft: true,
        ));

        $this->assertSame(0, $draft->refresh()->branch_like_count);

        $root->increment('like_count', 5);
        $this->recomputeBranchLikes($root);
        $service->publish($draft);

        $this->assertSame(105, $draft->refresh()->branch_like_count);
    }

    #[Test]
    public function a_recompute_leaves_drafts_out_of_the_branch(): void
    {
        $root = Chapter::factory()->liked(7)->create();
        $draft = Chapter::factory()->continuing($root)->draft()->create();

        $this->recomputeBranchLikes($root);

        $this->assertSame(7, $root->refresh()->branch_like_count);
        $this->assertSame(0, $draft->refresh()->branch_like_count);
    }

    #[Test]
    public function a_branch_overtaking_the_current_one_takes_it_over(): void
    {
        $root = Chapter::factory()->create();
        Chapter::factory()->continuing($root)->liked(2)->create();
        $challenger = Chapter::factory()->continuing($root)->liked(1)->create();
        $this->recomputeBranchLikes($root);

        $challenger->increment('like_count', 2);
        $this->recomputeBranchLikes($root);

        $this->assertSame($challenger->id, app(ChapterRepository::class)->lastChapterOfMainBranch($root->novel_id)?->id);
    }

    #[Test]
    public function a_branch_only_equalling_the_current_one_does_not_take_it_over(): void
    {
        $root = Chapter::factory()->create();
        $leader = Chapter::factory()->continuing($root)->liked(2)->create();
        $challenger = Chapter::factory()->continuing($root)->liked(1)->create(['published_at' => now()->subDay()]);
        $this->recomputeBranchLikes($root);

        $challenger->increment('like_count');
        $this->recomputeBranchLikes($root);

        $this->assertSame($leader->id, app(ChapterRepository::class)->lastChapterOfMainBranch($root->novel_id)?->id);
    }

    #[Test]
    public function an_unsupported_continuation_does_not_become_the_end_of_the_main_branch(): void
    {
        $root = Chapter::factory()->create();
        $leader = Chapter::factory()->continuing($root)->liked(2)->create(['published_at' => now()->subDay()]);
        $this->recomputeBranchLikes($root);

        Chapter::factory()->continuing($leader)->create();
        $this->recomputeBranchLikes($root);

        $this->assertSame($leader->id, app(ChapterRepository::class)->lastChapterOfMainBranch($root->novel_id)?->id);
    }

    #[Test]
    public function a_recompute_does_not_make_the_novel_look_touched_again(): void
    {
        $root = Chapter::factory()->create();
        Chapter::factory()->continuing($root)->create();
        $root->increment('like_count');

        $this->travel(1)->seconds();
        $this->recomputeBranchLikes($root);

        $this->assertTrue(
            Chapter::where('novel_id', $root->novel_id)
                ->where('updated_at', '>=', Novel::findOrFail($root->novel_id)->branch_recomputed_at)
                ->doesntExist()
        );
    }
}
