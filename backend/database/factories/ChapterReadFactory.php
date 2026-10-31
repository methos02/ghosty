<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\ChapterRead;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ChapterRead>
 */
class ChapterReadFactory extends Factory
{
    protected $model = ChapterRead::class;

    public function definition(): array
    {
        return [
            'chapter_id' => ChapterFactory::new(),
            'user_id' => null,
            'session_key' => fake()->uuid(),
        ];
    }

    public function by(User $user): static
    {
        return $this->state(fn () => ['user_id' => $user->id]);
    }

    public function on(Chapter $chapter): static
    {
        return $this->state(fn () => ['chapter_id' => $chapter->id]);
    }

    public function inSession(string $sessionKey): static
    {
        return $this->state(fn () => ['session_key' => $sessionKey]);
    }
}
