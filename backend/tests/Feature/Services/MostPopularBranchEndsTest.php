<?php

namespace Tests\Feature\Services;

use App\Models\Chapter;
use App\Models\Novel;
use App\Repositories\ChapterRepository;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MostPopularBranchEndsTest extends TestCase
{
    #[Test]
    public function ranks_complete_branches_by_what_their_branch_accumulated(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $root = Chapter::factory()->liked(5)->create(['novel_id' => $novel->id]);

        $modest = Chapter::factory()->continuing($root)->liked(1)->create();
        $rich = Chapter::factory()->continuing($modest)->liked(80)->create();
        $short = Chapter::factory()->continuing($root)->liked(40)->create();

        $branches = app(ChapterRepository::class)->mostPopularBranchEnds($novel->slug, 3);

        $this->assertSame([$rich->id, $short->id], $branches->pluck('id')->all());
        $this->assertSame([86, 45], $branches->pluck('branch_like_count')->all());
    }

    #[Test]
    public function a_branch_carries_its_length_alongside_its_weight(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $chapter = Chapter::factory()->liked(2)->create(['novel_id' => $novel->id]);

        for ($i = 0; $i < 3; $i++) {
            $chapter = Chapter::factory()->continuing($chapter)->liked(2)->create();
        }

        $branch = app(ChapterRepository::class)->mostPopularBranchEnds($novel->slug, 1)->firstOrFail();

        $this->assertSame(3, $branch->depth);
        $this->assertSame(8, $branch->branch_like_count);
    }

    #[Test]
    public function a_continued_chapter_is_not_a_branch_end(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $root = Chapter::factory()->create(['novel_id' => $novel->id]);
        $middle = Chapter::factory()->continuing($root)->liked(90)->create();
        $end = Chapter::factory()->continuing($middle)->liked(1)->create();

        $branches = app(ChapterRepository::class)->mostPopularBranchEnds($novel->slug, 5);

        $this->assertSame([$end->id], $branches->pluck('id')->all());
    }

    #[Test]
    public function honours_the_requested_limit(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $root = Chapter::factory()->create(['novel_id' => $novel->id]);

        for ($i = 1; $i <= 4; $i++) {
            Chapter::factory()->continuing($root)->liked($i)->create();
        }

        $this->assertCount(2, app(ChapterRepository::class)->mostPopularBranchEnds($novel->slug, 2));
    }
}
