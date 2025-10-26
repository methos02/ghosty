<?php

namespace Tests\Feature;

use App\Models\Genre;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class GenreControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_genres(): void
    {
        Genre::create(['name' => 'Science Fiction']);
        Genre::create(['name' => 'Horreur']);
        Genre::create(['name' => 'Aventure']);

        $response = $this->getJson('/api/v1/genres');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug'],
                ],
            ]);
    }

    public function test_genres_are_ordered_by_name(): void
    {
        Genre::create(['name' => 'Thriller']);
        Genre::create(['name' => 'Aventure']);
        Genre::create(['name' => 'Horreur']);

        $response = $this->getJson('/api/v1/genres');

        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertEquals('Aventure', $data[0]['name']);
        $this->assertEquals('Horreur', $data[1]['name']);
        $this->assertEquals('Thriller', $data[2]['name']);
    }

    public function test_slug_is_auto_generated(): void
    {
        $genre = Genre::create(['name' => 'Science Fiction']);

        $this->assertEquals('science-fiction', $genre->slug);
    }

    public function test_genres_are_cached(): void
    {
        Genre::create(['name' => 'Science Fiction']);

        Cache::flush();

        $this->assertFalse(Cache::has('genres'));

        $this->getJson('/api/v1/genres');

        $this->assertTrue(Cache::has('genres'));
    }
}
