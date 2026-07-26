<?php

namespace Tests\Feature\Api\V1\NovelController;

use App\Models\Genre;
use App\Models\Novel;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NovelControllerIndexTest extends TestCase
{
    private string $route = '/api/v1/novels';

    #[Test]
    public function returns_novels_with_their_genre(): void
    {
        $genre = Genre::factory()->create(['name' => 'Science Fiction']);
        $novel = Novel::factory()->create([
            'title' => 'Dune',
            'genre_id' => $genre->id,
            'cover_url' => 'https://example.com/dune.jpg',
            'is_favorite' => true,
        ]);

        $response = $this->getJson($this->route);

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $novel->id);
        $response->assertJsonPath('data.0.title', 'Dune');
        $response->assertJsonPath('data.0.cover_url', 'https://example.com/dune.jpg');
        $response->assertJsonPath('data.0.is_favorite', true);
        $response->assertJsonPath('data.0.genre.id', $genre->id);
        $response->assertJsonPath('data.0.genre.name', 'Science Fiction');
    }

    #[Test]
    public function paginates_fifteen_per_page(): void
    {
        Novel::factory()->count(16)->create();

        $response = $this->getJson($this->route);

        $response->assertOk();
        $response->assertJsonCount(15, 'data');
        $response->assertJsonPath('meta.per_page', 15);
        $response->assertJsonPath('meta.total', 16);
    }
}
