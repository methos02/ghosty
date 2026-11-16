<?php

namespace App\Policies;

use App\Models\User;

/**
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 */
class UserPolicy
{
    public function moderate(User $user, User $reportedUser): bool
    {
        return $user->canModerate() && $user->id !== $reportedUser->id;
    }

    /**
     * @see memory-bank/decisions/ADR-18-indicateurs-du-mvp.md
     */
    public function viewMetrics(User $user): bool
    {
        return $user->canViewMetrics();
    }
}
