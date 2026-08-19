<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GenreModelTest extends TestCase
{
    #[Test]
    public function generates_slug_from_name_on_creation(): void
    {
        $genre = Genre::factory()->create(['name' => 'Science Fiction']);

        $this->assertSame('science-fiction', $genre->slug);
    }

    #[Test]
    public function suffixes_a_slug_already_taken_by_another_genre(): void
    {
        Genre::factory()->create(['name' => 'Science Fiction']);

        $twin = Genre::factory()->create(['name' => 'Science-Fiction']);

        $this->assertSame('science-fiction-2', $twin->slug);
    }
}
