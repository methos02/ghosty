<?php

namespace Tests\Feature\Api\V1\CommentController;

use App\Models\Chapter;
use App\Models\Comment;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommentControllerIndexForNovelTest extends TestCase
{
    #[Test]
    public function lists_the_comments_on_the_novel_without_those_on_its_chapters(): void
    {
        $root = Chapter::factory()->create();
        $onNovel = Comment::factory()->on($root->novel)->create();
        Comment::factory()->on($root)->create();

        $this->getJson("/api/v1/novels/{$root->novel->slug}/comments")
            ->assertOk()
            ->assertJsonPath('comments.*.id', [$onNovel->id]);
    }

    #[Test]
    public function hides_the_comments_of_a_draft_novel(): void
    {
        $draftRoot = Chapter::factory()->draft()->create();

        $this->getJson("/api/v1/novels/{$draftRoot->novel->slug}/comments")->assertNotFound();
    }
}
