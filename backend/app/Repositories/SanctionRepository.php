<?php

namespace App\Repositories;

use App\Models\Sanction;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class SanctionRepository
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Sanction
    {
        return Sanction::create($attributes);
    }

    /**
     * @return Collection<int, Sanction>
     */
    public function listByUser(User $user): Collection
    {
        return $user->sanctions()
            ->latest()
            ->orderByDesc('id')
            ->get();
    }
}
