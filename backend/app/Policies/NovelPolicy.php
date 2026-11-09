<?php

namespace App\Policies;

use App\Models\Novel;
use App\Models\User;

class NovelPolicy
{
    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    public function create(User $user): bool
    {
        return ! $user->isWriteBanned();
    }

    /**
     * @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
     */
    public function update(User $user, Novel $novel): bool
    {
        if ($user->isWriteBanned() || $user->id !== $novel->author_id) {
            return false;
        }

        return $novel->rootChapter()->first()?->isDraft() ?? false;
    }
}
