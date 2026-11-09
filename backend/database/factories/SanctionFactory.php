<?php

namespace Database\Factories;

use App\Enums\SanctionType;
use App\Models\Sanction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sanction>
 */
class SanctionFactory extends Factory
{
    protected $model = Sanction::class;

    public function definition(): array
    {
        return [
            'user_id' => UserFactory::new(),
            'moderator_id' => UserFactory::new()->moderator(),
            'type' => SanctionType::AccountBan,
            'until' => now()->addDays(7),
            'reason' => fake()->sentence(),
        ];
    }

    public function ofType(SanctionType $type): static
    {
        return $this->state(fn () => ['type' => $type]);
    }

    public function permanent(): static
    {
        return $this->state(fn () => ['until' => null]);
    }

    public function expired(): static
    {
        return $this->state(fn () => ['until' => now()->subDay()]);
    }
}
