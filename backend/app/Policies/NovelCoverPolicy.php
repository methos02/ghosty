<?php

namespace App\Policies;

use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class NovelCoverPolicy
{
    public function view(?User $user, NovelCover $cover): Response
    {
        if ($cover->isPublished()) {
            return Response::allow();
        }

        return Response::denyAsNotFound();
    }

    public function create(User $user, Novel $novel): bool
    {
        if ($user->isWriteBanned()) {
            return false;
        }

        return $novel->isPublished();
    }

    public function update(User $user, NovelCover $cover): bool
    {
        if ($user->isWriteBanned() || $user->id !== $cover->author_id) {
            return false;
        }

        return $cover->isPublished();
    }

    public function moderate(User $user, NovelCover $cover): bool
    {
        return $user->canModerate() && $cover->isPublished();
    }

    public function restore(User $user, NovelCover $cover): bool
    {
        return $user->canModerate() && $cover->isHidden();
    }
}
