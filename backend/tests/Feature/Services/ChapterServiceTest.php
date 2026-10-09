<?php

namespace Tests\Feature\Services;

use App\DTO\ChapterDTO;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Services\ChapterService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterServiceTest extends TestCase
{
    private function lastChapterOfMainBranchOf(Chapter $chapter): ?int
    {
        return app(ChapterRepository::class)->lastChapterOfMainBranch($chapter->novel_id)?->id;
    }

    #[Test]
    public function a_published_first_chapter_starts_the_main_branch(): void
    {
        $novel = Novel::factory()->create();

        $root = app(ChapterService::class)->create(
            $novel,
            User::factory()->create(),
            new ChapterDTO('Le virage', str_repeat('La voiture avait quitté la route. ', 10))
        );

        $this->assertSame($root->id, $this->lastChapterOfMainBranchOf($root));
    }

    #[Test]
    public function deleting_a_chapter_of_the_main_branch_shortens_it_to_its_parent(): void
    {
        $root = Chapter::factory()->create();
        $second = Chapter::factory()->continuing($root)->liked(5)->create();
        $third = Chapter::factory()->continuing($second->refresh())->liked(1)->create();

        app(ChapterService::class)->delete($third);

        $this->assertSame($second->id, $this->lastChapterOfMainBranchOf($root));
        $this->assertNull(Novel::findOrFail($root->novel_id)->branch_recomputed_at);
    }

    #[Test]
    public function deleting_a_chapter_outside_the_main_branch_leaves_it_untouched(): void
    {
        $root = Chapter::factory()->create();
        $leader = Chapter::factory()->continuing($root)->liked(5)->create();
        $alternative = Chapter::factory()->continuing($root)->liked(1)->create();

        app(ChapterService::class)->delete($alternative);

        $this->assertSame($leader->id, $this->lastChapterOfMainBranchOf($root));
    }
}
