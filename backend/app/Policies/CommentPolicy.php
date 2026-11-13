<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\Contracts\Commentable;
use App\Models\User;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentPolicy
{
    public function create(User $user, Commentable $commentable): bool
    {
        if ($user->isCommentBanned()) {
            return false;
        }

        return $commentable->isOpenToComments();
    }

    public function reply(User $user, Comment $parent): bool
    {
        if ($user->isCommentBanned() || ! $parent->isVisible() || $parent->isReply()) {
            return false;
        }

        return $parent->target()->isOpenToComments();
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    public function moderate(User $user, Comment $comment): bool
    {
        return $user->canModerate() && $comment->isVisible();
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    public function restore(User $user, Comment $comment): bool
    {
        return $user->canModerate() && $comment->isHidden();
    }

    public function delete(User $user, Comment $comment): bool
    {
        if ($user->isBanned() || $user->id !== $comment->author_id) {
            return false;
        }

        return $comment->isVisible();
    }
}
