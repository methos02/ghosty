<?php

namespace Tests\Feature\Api\V1\ChapterController;

use App\Models\Chapter;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterControllerShowTest extends TestCase
{
    #[Test]
    public function returns_the_chapter_with_its_full_text(): void
    {
        $chapter = Chapter::factory()->create([
            'title' => 'Le virage',
            'content' => 'La voiture avait quitté la route au troisième virage.',
        ]);

        $response = $this->getJson("/api/v1/chapters/{$chapter->id}");

        $response->assertOk()
            ->assertJsonPath('id', $chapter->id)
            ->assertJsonPath('title', 'Le virage')
            ->assertJsonPath('content', 'La voiture avait quitté la route au troisième virage.');
    }

    #[Test]
    public function exposes_the_author_username(): void
    {
        $author = User::factory()->create(['username' => 'auteur2']);
        $chapter = Chapter::factory()->create(['author_id' => $author->id]);

        $response = $this->getJson("/api/v1/chapters/{$chapter->id}");

        $response->assertOk()
            ->assertJsonPath('author.username', 'auteur2');
    }

    #[Test]
    public function reports_a_proposal_as_not_being_a_branch(): void
    {
        $chapter = Chapter::factory()->create();

        $response = $this->getJson("/api/v1/chapters/{$chapter->id}");

        $response->assertOk()
            ->assertJsonPath('is_continued', false)
            ->assertJsonPath('continuations_count', 0);
    }

    #[Test]
    public function reports_a_continued_chapter_as_a_branch(): void
    {
        $chapter = Chapter::factory()->create();
        Chapter::factory()->continuing($chapter)->create();

        $response = $this->getJson("/api/v1/chapters/{$chapter->id}");

        $response->assertOk()
            ->assertJsonPath('is_continued', true)
            ->assertJsonPath('continuations_count', 1);
    }

    #[Test]
    public function returns_not_found_for_an_unknown_chapter(): void
    {
        $this->getJson('/api/v1/chapters/999')->assertNotFound();
    }
}
