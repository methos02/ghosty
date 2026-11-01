<?php

namespace App\Policies;

use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Novel;
use App\Models\User;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentPolicy
{
    public function create(User $user, Chapter|Novel $commentable): bool
    {
        if ($user->isBanned()) {
            return false;
        }

        return $commentable->isOpenToComments();
    }

    public function reply(User $user, Comment $parent): bool
    {
        if ($user->isBanned() || ! $parent->isVisible() || $parent->isReply()) {
            return false;
        }

        return $parent->target()->isOpenToComments();
    }

    public function delete(User $user, Comment $comment): bool
    {
        if ($user->isBanned() || $user->id !== $comment->author_id) {
            return false;
        }

        return $comment->isVisible();
    }
}
