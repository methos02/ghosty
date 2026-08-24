<?php

namespace App\Policies;

use App\Models\User;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class ReportPolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->isBanned()) {
            return false;
        }

        return $user->isModerator() || $user->isAdmin();
    }
}
