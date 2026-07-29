<?php

namespace Database\Factories;

use App\Models\Work;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Work>
 */
class WorkFactory extends Factory
{
    protected $model = Work::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'novel_id' => NovelFactory::new(),
            'author_id' => UserFactory::new(),
            'title' => fake()->sentence(3),
            'content' => fake()->paragraphs(3, true),
            'order' => 1,
            'type' => Work::TYPE_CHAPTER,
        ];
    }
}
