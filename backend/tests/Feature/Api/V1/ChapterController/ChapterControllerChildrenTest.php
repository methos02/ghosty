<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Models\Chapter;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerChildrenTest extends TestCase
{
    #[Test]
    public function returns_every_proposed_continuation(): void
    {
        $parent = Chapter::factory()->create();
        Chapter::factory()->continuing($parent)->count(3)->create();

        $response = $this->getJson("/api/v1/chapters/{$parent->id}/children");

        $response->assertOk()->assertJsonCount(3, 'chapters');
    }

    #[Test]
    public function orders_continuations_by_likes(): void
    {
        $parent = Chapter::factory()->create();
        $leastLiked = Chapter::factory()->continuing($parent)->create(['like_count' => 2]);
        $mostLiked = Chapter::factory()->continuing($parent)->create(['like_count' => 30]);

        $response = $this->getJson("/api/v1/chapters/{$parent->id}/children");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$mostLiked->id, $leastLiked->id]);
    }

    #[Test]
    public function keeps_the_earliest_published_ahead_when_likes_are_tied(): void
    {
        $parent = Chapter::factory()->create();
        $earliest = Chapter::factory()->continuing($parent)->create([
            'like_count' => 5,
            'published_at' => now()->subDays(3),
        ]);
        $latest = Chapter::factory()->continuing($parent)->create([
            'like_count' => 5,
            'published_at' => now(),
        ]);

        $response = $this->getJson("/api/v1/chapters/{$parent->id}/children");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$earliest->id, $latest->id]);
    }

    #[Test]
    public function excludes_continuations_hidden_by_moderation(): void
    {
        $parent = Chapter::factory()->create();
        $visible = Chapter::factory()->continuing($parent)->create();
        Chapter::factory()->continuing($parent)->hidden()->create();

        $response = $this->getJson("/api/v1/chapters/{$parent->id}/children");

        $response->assertOk()
            ->assertJsonPath('chapters.*.id', [$visible->id]);
    }

    #[Test]
    public function returns_an_empty_list_for_a_chapter_without_continuation(): void
    {
        $chapter = Chapter::factory()->create();

        $response = $this->getJson("/api/v1/chapters/{$chapter->id}/children");

        $response->assertOk()->assertJsonCount(0, 'chapters');
    }

    #[Test]
    public function leaves_the_full_text_out_of_the_continuation_list(): void
    {
        $parent = Chapter::factory()->create();
        Chapter::factory()->continuing($parent)->create();

        $this->getJson("/api/v1/chapters/{$parent->id}/children")
            ->assertOk()
            ->assertJsonPath('chapters.0.title', fn ($title) => $title !== null)
            ->assertJsonMissingPath('chapters.0.content');
    }
}
