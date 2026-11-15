<?php

namespace App\Http\Resources;

use App\Models\User;

/**
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 *
 * @mixin User
 */
class UserSummaryResource extends UserProfileResource
{
    /**
     * @return array<string, mixed>
     */
    protected function detailAttributes(): array
    {
        return [];
    }
}
