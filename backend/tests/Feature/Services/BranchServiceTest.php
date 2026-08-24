<?php

namespace Tests\Feature\Services;

use App\DTO\ChapterDTO;
use App\Models\Chapter;
use App\Models\User;
use App\Services\BranchService;
use App\Services\ChapterService;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BranchServiceTest extends TestCase
{
    #[Test]
    public function a_like_raises_the_weight_of_the_chapter_and_of_everything_it_leads_to(): void
    {
        $root = Chapter::factory()->liked(4)->create();
        $second = Chapter::factory()->continuing($root)->liked(6)->create();
        $third = Chapter::factory()->continuing($second)->liked(1)->create();

        app(BranchService::class)->applyLike($second);

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

        app(BranchService::class)->applyLike($supported);

        $this->assertSame(4, $supported->refresh()->branch_like_count);
        $this->assertSame(3, $alternative->refresh()->branch_like_count);
    }

    #[Test]
    public function a_like_also_counts_for_the_chapter_itself(): void
    {
        $chapter = Chapter::factory()->liked(2)->create();

        app(BranchService::class)->applyLike($chapter);

        $this->assertSame(3, $chapter->refresh()->like_count);
    }

    #[Test]
    public function withdrawing_a_like_rolls_the_weight_back(): void
    {
        $root = Chapter::factory()->liked(5)->create();
        $second = Chapter::factory()->continuing($root)->create();
        $service = app(BranchService::class);

        $service->applyLike($root);
        $service->applyLike($root, -1);

        $this->assertSame(5, $root->refresh()->branch_like_count);
        $this->assertSame(5, $second->refresh()->branch_like_count);
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

        app(BranchService::class)->applyLike($root, 5);
        $service->publish($draft);

        $this->assertSame(105, $draft->refresh()->branch_like_count);
    }

    #[Test]
    public function a_like_costs_a_single_write_whatever_the_branch_length(): void
    {
        $root = Chapter::factory()->create();
        $deepest = $root;

        for ($i = 0; $i < 8; $i++) {
            $deepest = Chapter::factory()->continuing($deepest)->create();
        }

        $writes = 0;

        DB::listen(function (QueryExecuted $query) use (&$writes) {
            if (str_starts_with(strtolower($query->sql), 'update')) {
                $writes++;
            }
        });

        app(BranchService::class)->applyLike($root);

        $this->assertSame(2, $writes);
        $this->assertSame(1, $deepest->refresh()->branch_like_count);
    }
}
