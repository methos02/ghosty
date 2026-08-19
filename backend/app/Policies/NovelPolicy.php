<?php

namespace App\Policies;

use App\Models\Novel;
use App\Models\User;

class NovelPolicy
{
    /**
     * @see memory-bank/decisions/ADR-01-modele-de-ban-utilisateur.md
     */
    public function create(User $user): bool
    {
        return ! $user->isBanned();
    }

    /**
     * @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
     */
    public function update(User $user, Novel $novel): bool
    {
        if ($user->isBanned() || $user->id !== $novel->author_id) {
            return false;
        }

        return $novel->rootChapter()->first()?->isDraft() ?? false;
    }
}
