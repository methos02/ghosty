<?php

namespace Tests\Feature\Api\V1\GenreController;

use App\Models\Genre;
use Illuminate\Support\Facades\Cache;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GenreControllerIndexTest extends TestCase
{
    private string $route = '/api/v1/genres';

    #[Test]
    public function lists_genres_ordered_by_name(): void
    {
        Genre::factory()->create(['name' => 'Thriller']);
        Genre::factory()->create(['name' => 'Aventure']);
        Genre::factory()->create(['name' => 'Horreur']);

        $response = $this->getJson($this->route);

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
        $response->assertJsonPath('data.0.name', 'Aventure');
        $response->assertJsonPath('data.1.name', 'Horreur');
        $response->assertJsonPath('data.2.name', 'Thriller');
        $response->assertJsonPath('data.0.slug', 'aventure');
    }

    #[Test]
    public function caches_result(): void
    {
        Cache::flush();
        Genre::factory()->create(['name' => 'Science Fiction']);

        $this->getJson($this->route)->assertOk();

        $this->assertTrue(Cache::has('genres'));
    }
}
