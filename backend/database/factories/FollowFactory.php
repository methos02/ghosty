<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Follow>
 */
class FollowFactory extends Factory
{
    protected $model = Follow::class;

    public function definition(): array
    {
        return [
            'user_id' => UserFactory::new(),
            'chapter_id' => ChapterFactory::new(),
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
}
