<?php

namespace Tests\Feature\Console;

use App\Models\Chapter;
use App\Models\Novel;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RecomputeBranchLikeCountsCommandTest extends TestCase
{
    #[Test]
    public function it_settles_the_branch_totals_of_every_pending_novel(): void
    {
        $first = Chapter::factory()->create();
        $firstChild = Chapter::factory()->continuing($first)->create();
        $second = Chapter::factory()->create();

        $first->increment('like_count', 3);
        $second->increment('like_count', 2);

        $this->assertSame(Command::SUCCESS, Artisan::call('ghosty:recompute-branch-likes'));

        $this->assertSame(3, $first->refresh()->branch_like_count);
        $this->assertSame(3, $firstChild->refresh()->branch_like_count);
        $this->assertSame(2, $second->refresh()->branch_like_count);
    }

    #[Test]
    public function it_leaves_novels_with_no_pending_support_alone(): void
    {
        $chapter = Chapter::factory()->liked(4)->create();

        $this->assertSame(Command::SUCCESS, Artisan::call('ghosty:recompute-branch-likes'));

        $this->assertSame(4, $chapter->refresh()->branch_like_count);
    }

    #[Test]
    public function it_records_when_it_last_settled_a_novel(): void
    {
        $chapter = Chapter::factory()->create();
        $chapter->increment('like_count');

        $this->assertSame(Command::SUCCESS, Artisan::call('ghosty:recompute-branch-likes'));

        $this->assertNotNull(Novel::findOrFail($chapter->novel_id)->branch_recomputed_at);
    }

    #[Test]
    public function it_settles_a_novel_again_once_a_new_support_lands(): void
    {
        $root = Chapter::factory()->create();
        $continuation = Chapter::factory()->continuing($root)->create();

        Artisan::call('ghosty:recompute-branch-likes');

        $this->travel(1)->seconds();
        $root->increment('like_count');
        Artisan::call('ghosty:recompute-branch-likes');

        $this->assertSame(1, $continuation->refresh()->branch_like_count);
    }

    #[Test]
    public function a_support_sharing_the_instant_of_a_pass_is_caught_by_the_next_one(): void
    {
        $this->freezeTime();

        $root = Chapter::factory()->create();
        $continuation = Chapter::factory()->continuing($root)->create();
        $root->increment('like_count');

        Artisan::call('ghosty:recompute-branch-likes');

        Chapter::whereKey($continuation->id)->toBase()->update(['branch_like_count' => 0]);
        Artisan::call('ghosty:recompute-branch-likes');

        $this->assertSame(1, $continuation->refresh()->branch_like_count);
    }

    #[Test]
    public function it_leaves_a_settled_novel_out_of_the_next_pass(): void
    {
        $chapter = Chapter::factory()->create();
        $chapter->increment('like_count');

        $this->travel(1)->seconds();
        Artisan::call('ghosty:recompute-branch-likes');
        $settledAt = Novel::findOrFail($chapter->novel_id)->branch_recomputed_at;

        $this->travel(10)->seconds();
        Artisan::call('ghosty:recompute-branch-likes');

        $this->assertEquals($settledAt, Novel::findOrFail($chapter->novel_id)->branch_recomputed_at);
    }
}
