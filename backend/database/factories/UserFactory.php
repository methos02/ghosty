<?php

namespace Database\Factories;

use App\Enums\SanctionType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function banned(SanctionType $type = SanctionType::AccountBan): static
    {
        return $this->has(SanctionFactory::new()->ofType($type), 'sanctions');
    }

    public function moderator(): static
    {
        return $this->state(fn (array $attributes) => [
            'roles' => [User::ROLE_READER, User::ROLE_MODERATOR],
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'roles' => [User::ROLE_READER, User::ROLE_ADMIN],
        ]);
    }
}
