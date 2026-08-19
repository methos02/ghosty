<?php

namespace Database\Factories;

use App\Models\Chapter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Chapter>
 */
class ChapterFactory extends Factory
{
    protected $model = Chapter::class;

    public function definition(): array
    {
        return [
            'novel_id' => NovelFactory::new(),
            'parent_id' => null,
            'author_id' => UserFactory::new(),
            'title' => fake()->sentence(3),
            'summary' => fake()->sentence(12),
            'content' => fake()->paragraphs(3, true),
            'path' => '',
            'depth' => 0,
            'status' => Chapter::STATUS_PUBLISHED,
            'published_at' => now(),
        ];
    }

    public function continuing(Chapter $parent): static
    {
        return $this->state(fn () => [
            'novel_id' => $parent->novel_id,
            'parent_id' => $parent->id,
            'depth' => $parent->depth + 1,
        ])->afterCreating(function (Chapter $chapter) use ($parent) {
            $chapter->forceFill([
                'path' => $parent->path.$chapter->id.Chapter::PATH_SEPARATOR,
                'branch_like_count' => $parent->branch_like_count + $chapter->like_count,
            ])->save();

            if ($chapter->isPublished()) {
                $parent->increment('continuations_count');
            }
        });
    }

    public function liked(int $count): static
    {
        return $this->state(fn () => [
            'like_count' => $count,
            'branch_like_count' => $count,
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => Chapter::STATUS_DRAFT,
            'published_at' => null,
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn () => ['status' => Chapter::STATUS_ARCHIVED]);
    }

    public function hidden(): static
    {
        return $this->state(fn () => ['status' => Chapter::STATUS_HIDDEN]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Chapter $chapter) {
            if ($chapter->path !== '') {
                return;
            }

            $chapter->update(['path' => Chapter::PATH_SEPARATOR.$chapter->id.Chapter::PATH_SEPARATOR]);
        });
    }
}
