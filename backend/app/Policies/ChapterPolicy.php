<?php

namespace App\Policies;

use App\Models\Chapter;
use App\Models\User;

class ChapterPolicy
{
    public function create(User $user, Chapter $parent): bool
    {
        if ($user->isBanned()) {
            return false;
        }

        return $parent->isPublished();
    }

    /**
     * @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
     */
    public function update(User $user, Chapter $chapter): bool
    {
        if (! $this->isOwnWork($user, $chapter)) {
            return false;
        }

        if ($chapter->isDraft()) {
            return true;
        }

        return $chapter->isPublished() && $chapter->isCorrectable();
    }

    public function publish(User $user, Chapter $chapter): bool
    {
        return $this->isOwnWork($user, $chapter) && $chapter->isDraft();
    }

    public function delete(User $user, Chapter $chapter): bool
    {
        return $this->isOwnWork($user, $chapter) && $chapter->isDraft();
    }

    private function isOwnWork(User $user, Chapter $chapter): bool
    {
        return ! $user->isBanned() && $user->id === $chapter->author_id;
    }
}
