<?php

namespace Tests\Feature\Services;

use App\Models\Chapter;
use App\Models\User;
use App\Services\LikeService;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LikeServiceTest extends TestCase
{
    #[Test]
    public function a_support_counts_for_the_chapter_itself(): void
    {
        $chapter = Chapter::factory()->liked(2)->create();

        app(LikeService::class)->like(User::factory()->create(), $chapter, null);

        $this->assertSame(3, $chapter->refresh()->like_count);
    }

    #[Test]
    public function a_second_support_from_the_same_reader_changes_nothing(): void
    {
        $chapter = Chapter::factory()->create();
        $reader = User::factory()->create();
        $service = app(LikeService::class);

        $service->like($reader, $chapter, null);

        $this->assertFalse($service->like($reader, $chapter, null));
        $this->assertSame(1, $chapter->refresh()->like_count);
        $this->assertDatabaseCount('likes', 1);
    }

    #[Test]
    public function withdrawing_a_support_that_was_never_given_changes_nothing(): void
    {
        $chapter = Chapter::factory()->liked(4)->create();

        $this->assertFalse(app(LikeService::class)->unlike(User::factory()->create(), $chapter));
        $this->assertSame(4, $chapter->refresh()->like_count);
    }

    #[Test]
    public function a_support_writes_a_single_row_whatever_the_branch_length(): void
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

        app(LikeService::class)->like(User::factory()->create(), $root, null);

        $this->assertSame(1, $writes);
        $this->assertSame(0, $deepest->refresh()->branch_like_count);
    }

    #[Test]
    public function a_support_marks_the_chapter_as_touched_for_the_next_pass(): void
    {
        $chapter = Chapter::factory()->create();
        $this->travel(1)->minutes();

        app(LikeService::class)->like(User::factory()->create(), $chapter, null);

        $this->assertEquals(now()->startOfSecond(), $chapter->refresh()->updated_at);
    }
}
