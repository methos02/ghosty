<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\ReadingProgress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReadingProgress>
 */
class ReadingProgressFactory extends Factory
{
    protected $model = ReadingProgress::class;

    public function definition(): array
    {
        return [
            'user_id' => UserFactory::new(),
            'novel_id' => NovelFactory::new(),
            'chapter_id' => ChapterFactory::new(),
            'read_at' => now(),
        ];
    }

    public function by(User $user): static
    {
        return $this->state(fn () => ['user_id' => $user->id]);
    }

    public function at(Chapter $chapter): static
    {
        return $this->state(fn () => [
            'novel_id' => $chapter->novel_id,
            'chapter_id' => $chapter->id,
        ]);
    }
}
