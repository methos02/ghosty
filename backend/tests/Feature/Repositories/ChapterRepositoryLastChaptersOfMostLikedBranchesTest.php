<?php

namespace Tests\Feature\Repositories;

use App\Models\Chapter;
use App\Models\Novel;
use App\Repositories\ChapterRepository;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterRepositoryLastChaptersOfMostLikedBranchesTest extends TestCase
{
    #[Test]
    public function orders_last_chapters_by_branch_like_count(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $root = Chapter::factory()->liked(5)->create(['novel_id' => $novel->id]);

        $modest = Chapter::factory()->continuing($root)->liked(1)->create();
        $rich = Chapter::factory()->continuing($modest)->liked(80)->create();
        $short = Chapter::factory()->continuing($root)->liked(40)->create();

        $branches = app(ChapterRepository::class)->lastChaptersOfMostLikedBranches($novel->slug, 3);

        $this->assertSame([$rich->id, $short->id], $branches->pluck('id')->all());
        $this->assertSame([86, 45], $branches->pluck('branch_like_count')->all());
    }

    #[Test]
    public function exposes_the_depth_and_branch_like_count_of_the_last_chapter(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $chapter = Chapter::factory()->liked(2)->create(['novel_id' => $novel->id]);

        for ($i = 0; $i < 3; $i++) {
            $chapter = Chapter::factory()->continuing($chapter)->liked(2)->create();
        }

        $branch = app(ChapterRepository::class)->lastChaptersOfMostLikedBranches($novel->slug, 1)->firstOrFail();

        $this->assertSame(3, $branch->depth);
        $this->assertSame(8, $branch->branch_like_count);
    }

    #[Test]
    public function excludes_a_continued_chapter(): void
    {
        $novel = Novel::factory()->create(['slug' => 'nuit-virage']);
        $root = Chapter::factory()->create(['novel_id' => $novel->id]);
        $middle = Chapter::factory()->continuing($root)->liked(90)->create();
        $end = Chapter::factory()->continuing($middle)->liked(1)->create();

        $branches = app(ChapterRepository::class)->lastChaptersOfMostLikedBranches($novel->slug, 5);

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

        $this->assertCount(2, app(ChapterRepository::class)->lastChaptersOfMostLikedBranches($novel->slug, 2));
    }
}
