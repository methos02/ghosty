<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Like;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends Factory<Like>
 */
class LikeFactory extends Factory
{
    protected $model = Like::class;

    public function definition(): array
    {
        return [
            'user_id' => UserFactory::new(),
            'likeable_type' => (new Chapter)->getMorphClass(),
            'likeable_id' => ChapterFactory::new(),
            'created_ip' => fake()->ipv4(),
        ];
    }

    public function on(Model $likeable): static
    {
        return $this->state(fn () => [
            'likeable_type' => $likeable->getMorphClass(),
            'likeable_id' => $likeable->getKey(),
        ]);
    }
}
