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
            'last_activity_at' => now(),
        ];
    }

    /**
     * Rattache le chapitre à un parent : profondeur, chemin et roman en
     * découlent, et le parent voit son compteur de suites augmenter.
     */
    public function continuing(Chapter $parent): static
    {
        return $this->state(fn () => [
            'novel_id' => $parent->novel_id,
            'parent_id' => $parent->id,
            'depth' => $parent->depth + 1,
        ])->afterCreating(function (Chapter $chapter) use ($parent) {
            $chapter->update(['path' => $parent->path.$chapter->id.Chapter::PATH_SEPARATOR]);
            $parent->increment('continuations_count');
        });
    }

    /**
     * Suite mise en avant parmi les propositions d'un même chapitre.
     */
    public function mainContinuity(): static
    {
        return $this->state(fn () => ['is_main_child' => true]);
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
