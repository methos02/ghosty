<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 */
class UserPolicy
{
    /**
     * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
     */
    public function view(?User $viewer, User $user): Response
    {
        if ($user->isDeleted()) {
            return Response::denyAsNotFound();
        }

        return Response::allow();
    }

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
