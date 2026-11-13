<?php

namespace Tests\Feature\Helpers;

use App\Models\Genre;
use App\Models\Novel;
use App\Models\NovelCover;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CoverUrlHelperTest extends TestCase
{
    #[Test]
    public function serves_the_cover_of_the_genre_when_the_novel_has_none(): void
    {
        $novel = Novel::factory()->create([
            'cover_url' => null,
            'genre_id' => Genre::factory()->create(['slug' => 'horreur'])->id,
        ]);

        $this->assertStringEndsWith('/images/covers/cover_default_horreur.jpg', $novel->coverUrl());
    }

    #[Test]
    public function serves_the_official_cover_before_any_other(): void
    {
        $novel = Novel::factory()->create(['cover_url' => 'https://images.example/nuit.jpg']);
        $official = NovelCover::factory()->on($novel)->create(['image_path' => 'covers/1/officielle.jpg']);
        $novel->forceFill(['official_cover_id' => $official->id])->save();

        $this->assertSame(Storage::disk('public')->url('covers/1/officielle.jpg'), $novel->refresh()->coverUrl());
    }

    #[Test]
    public function keeps_the_cover_the_novel_carries(): void
    {
        $novel = Novel::factory()->create(['cover_url' => 'https://images.example/nuit.jpg']);

        $this->assertSame('https://images.example/nuit.jpg', $novel->coverUrl());
    }

    #[Test]
    public function falls_back_on_the_blank_cover_for_a_genre_without_an_image(): void
    {
        $novel = Novel::factory()->create([
            'cover_url' => null,
            'genre_id' => Genre::factory()->create(['slug' => 'haiku-spatial'])->id,
        ]);

        $this->assertStringEndsWith('/images/covers/cover_default.jpg', $novel->coverUrl());
    }

    #[Test]
    public function the_api_never_leaves_a_novel_without_a_cover(): void
    {
        $novel = Novel::factory()->create(['cover_url' => null]);

        $this->getJson('/api/v1/novels')
            ->assertOk()
            ->assertJsonPath('novels.0.cover_url', $novel->coverUrl());
    }
}
