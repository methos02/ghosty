<?php

namespace Tests\Feature\Api\V1\NovelController;

use App\Models\Genre;
use App\Models\Novel;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NovelControllerShowTest extends TestCase
{
    #[Test]
    public function returns_novel_by_slug_with_author_genre_and_chapters_count(): void
    {
        $author = User::factory()->create(['username' => 'Victor Hugo']);
        $genre = Genre::factory()->create(['name' => 'Roman']);
        $novel = Novel::factory()->create([
            'title' => 'Les Misérables',
            'slug' => 'les-miserables',
            'genre_id' => $genre->id,
            'author_id' => $author->id,
            'chapter_count' => 2,
        ]);

        $response = $this->getJson('/api/v1/novels/les-miserables');

        $response->assertOk();
        $response->assertJsonPath('id', $novel->id);
        $response->assertJsonPath('slug', 'les-miserables');
        $response->assertJsonPath('title', 'Les Misérables');
        $response->assertJsonPath('chapters_count', 2);
        $response->assertJsonPath('author.id', $author->id);
        $response->assertJsonPath('author.username', 'Victor Hugo');
        $response->assertJsonPath('genre.id', $genre->id);
        $response->assertJsonPath('genre.name', 'Roman');
    }

    #[Test]
    public function returns_not_found_for_unknown_slug(): void
    {
        $response = $this->getJson('/api/v1/novels/roman-inexistant');

        $response->assertNotFound();
    }
}
