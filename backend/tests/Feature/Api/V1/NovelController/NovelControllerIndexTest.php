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
        $response->assertJsonCount(1, 'novels');
        $response->assertJsonPath('novels.0.id', $novel->id);
        $response->assertJsonPath('novels.0.title', 'Dune');
        $response->assertJsonPath('novels.0.cover_url', 'https://example.com/dune.jpg');
        $response->assertJsonPath('novels.0.is_favorite', true);
        $response->assertJsonPath('novels.0.genre.id', $genre->id);
        $response->assertJsonPath('novels.0.genre.name', 'Science Fiction');
    }

    #[Test]
    public function keeps_only_the_novels_of_the_requested_genre(): void
    {
        $fantasy = Genre::factory()->create(['name' => 'Fantastique']);
        Novel::factory()->create(['title' => 'Nuit virage', 'genre_id' => $fantasy->id]);
        Novel::factory()->create(['title' => 'Compte à rebours']);

        $response = $this->getJson($this->route.'?genre_id='.$fantasy->id);

        $response->assertOk()
            ->assertJsonCount(1, 'novels')
            ->assertJsonPath('novels.0.title', 'Nuit virage');
    }

    #[Test]
    public function combines_the_genre_filter_with_the_search(): void
    {
        $fantasy = Genre::factory()->create(['name' => 'Fantastique']);
        Novel::factory()->create(['title' => 'Nuit virage', 'genre_id' => $fantasy->id]);
        Novel::factory()->create(['title' => 'Nuit blanche']);

        $this->getJson($this->route.'?search=nuit&genre_id='.$fantasy->id)
            ->assertOk()
            ->assertJsonCount(1, 'novels')
            ->assertJsonPath('novels.0.title', 'Nuit virage');
    }

    #[Test]
    public function returns_every_novel_when_no_genre_is_requested(): void
    {
        Genre::factory()->create();
        Novel::factory()->count(2)->create();

        $this->getJson($this->route)->assertOk()->assertJsonCount(2, 'novels');
    }

    #[Test]
    public function keeps_only_the_novels_whose_title_matches_the_search(): void
    {
        Novel::factory()->create(['title' => 'Nuit virage']);
        Novel::factory()->create(['title' => 'Compte à rebours']);

        $response = $this->getJson($this->route.'?search=virage');

        $response->assertOk()
            ->assertJsonCount(1, 'novels')
            ->assertJsonPath('novels.0.title', 'Nuit virage');
    }

    #[Test]
    public function searches_without_case_sensitivity(): void
    {
        Novel::factory()->create(['title' => 'Nuit virage']);

        $this->getJson($this->route.'?search=VIRAGE')
            ->assertOk()
            ->assertJsonCount(1, 'novels');
    }

    #[Test]
    public function returns_every_novel_when_the_search_is_blank(): void
    {
        Novel::factory()->count(3)->create();

        $this->getJson($this->route.'?search=%20')
            ->assertOk()
            ->assertJsonCount(3, 'novels');
    }

    #[Test]
    public function paginates_fifteen_per_page(): void
    {
        Novel::factory()->count(16)->create();

        $response = $this->getJson($this->route);

        $response->assertOk();
        $response->assertJsonCount(15, 'novels');
        $response->assertJsonPath('meta.per_page', 15);
        $response->assertJsonPath('meta.total', 16);
    }
}
