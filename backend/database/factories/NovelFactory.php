<?php

namespace Database\Factories;

use App\Models\Novel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Novel>
 */
class NovelFactory extends Factory
{
    protected $model = Novel::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'genre_id' => GenreFactory::new(),
            'cover_url' => fake()->imageUrl(),
            'is_favorite' => false,
        ];
    }
}
