<?php

namespace App\Policies;

use App\Models\User;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ReportPolicy
{
    public function moderate(User $user): bool
    {
        return $user->canModerate();
    }
}
