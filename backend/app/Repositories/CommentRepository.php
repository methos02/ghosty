<?php

namespace App\Repositories;

use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Novel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentRepository
{
    /**
     * @return LengthAwarePaginator<int, Comment>
     */
    public function paginateThread(Chapter|Novel $commentable, int $perPage): LengthAwarePaginator
    {
        return Comment::query()
            ->with(['author', 'visibleReplies.author'])
            ->where('commentable_type', $commentable->getMorphClass())
            ->where('commentable_id', $commentable->id)
            ->topLevel()
            ->shownInThread()
            ->latest()
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function find(int $commentId): Comment
    {
        return Comment::query()
            ->findOrFail($commentId);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Comment
    {
        return Comment::query()
            ->create($attributes)
            ->load('author');
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Comment $comment, array $attributes): Comment
    {
        $comment->update($attributes);

        return $comment;
    }

    public function incrementReplyCount(Comment $parent): void
    {
        Comment::query()
            ->whereKey($parent->id)
            ->toBase()
            ->increment('reply_count');
    }

    public function decrementReplyCount(Comment $parent): void
    {
        Comment::query()
            ->whereKey($parent->id)
            ->where('reply_count', '>', 0)
            ->toBase()
            ->decrement('reply_count');
    }
}
