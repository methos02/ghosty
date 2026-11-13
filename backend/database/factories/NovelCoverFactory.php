<?php

namespace Database\Factories;

use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NovelCover>
 */
class NovelCoverFactory extends Factory
{
    protected $model = NovelCover::class;

    public function definition(): array
    {
        return [
            'novel_id' => NovelFactory::new(),
            'author_id' => UserFactory::new(),
            'image_path' => 'covers/'.fake()->uuid().'.jpg',
            'status' => NovelCover::STATUS_PUBLISHED,
        ];
    }

    public function on(Novel $novel): static
    {
        return $this->state(fn () => ['novel_id' => $novel->id]);
    }

    public function by(User $author): static
    {
        return $this->state(fn () => ['author_id' => $author->id]);
    }

    public function liked(int $count): static
    {
        return $this->afterCreating(fn (NovelCover $cover) => $cover->forceFill(['like_count' => $count])->save());
    }

    public function hidden(): static
    {
        return $this->state(fn () => ['status' => NovelCover::STATUS_HIDDEN]);
    }
}
