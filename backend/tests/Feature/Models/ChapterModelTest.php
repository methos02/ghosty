<?php

namespace Tests\Feature\Models;

use App\Models\Chapter;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterModelTest extends TestCase
{
    #[Test]
    public function a_chapter_without_parent_is_a_root(): void
    {
        $chapter = Chapter::factory()->create();

        $this->assertTrue($chapter->isRoot());
    }

    #[Test]
    public function a_child_is_not_a_root(): void
    {
        $root = Chapter::factory()->create();
        $child = Chapter::factory()->continuing($root)->create();

        $this->assertFalse($child->isRoot());
    }

    #[Test]
    public function a_proposal_without_child_is_not_a_branch(): void
    {
        $chapter = Chapter::factory()->create();

        $this->assertFalse($chapter->hasChildren());
    }

    #[Test]
    public function a_proposal_becomes_a_branch_once_continued(): void
    {
        $chapter = Chapter::factory()->create();
        Chapter::factory()->continuing($chapter)->create();

        $this->assertTrue($chapter->refresh()->hasChildren());
    }

    #[Test]
    public function the_path_of_a_root_holds_its_own_id(): void
    {
        $chapter = Chapter::factory()->create();

        $this->assertSame("/{$chapter->id}/", $chapter->path);
    }

    #[Test]
    public function the_path_of_a_child_extends_its_parent_path(): void
    {
        $root = Chapter::factory()->create();
        $child = Chapter::factory()->continuing($root)->create();

        $this->assertSame("/{$root->id}/{$child->id}/", $child->refresh()->path);
    }

    #[Test]
    public function a_root_has_no_ancestor(): void
    {
        $chapter = Chapter::factory()->create();

        $this->assertSame([], $chapter->ancestorIds());
    }

    #[Test]
    public function ancestors_are_read_from_the_path_in_order(): void
    {
        $root = Chapter::factory()->create();
        $second = Chapter::factory()->continuing($root)->create();
        $third = Chapter::factory()->continuing($second->refresh())->create();

        $this->assertSame([$root->id, $second->id], $third->refresh()->ancestorIds());
    }

    #[Test]
    public function the_depth_grows_with_each_child(): void
    {
        $root = Chapter::factory()->create();
        $second = Chapter::factory()->continuing($root)->create();

        $this->assertSame(0, $root->depth);
        $this->assertSame(1, $second->depth);
    }

    #[Test]
    public function the_branches_scope_keeps_only_continued_chapters(): void
    {
        $continued = Chapter::factory()->create();
        Chapter::factory()->continuing($continued)->create();
        Chapter::factory()->create();

        $branches = Chapter::query()->hasChildren()->get();

        $this->assertSame([$continued->id], $branches->pluck('id')->all());
    }
}
