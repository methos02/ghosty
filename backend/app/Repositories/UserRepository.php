<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): User
    {
        return User::create($attributes);
    }

    public function findByEmailOrUsername(string $identifier): ?User
    {
        return User::query()->where('email', $identifier)->first()
            ?? User::query()->where('username', $identifier)->first();
    }
}
