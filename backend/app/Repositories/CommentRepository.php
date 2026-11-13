<?php

namespace App\Repositories;

use App\Models\Comment;
use App\Models\Contracts\Commentable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentRepository
{
    /**
     * @return LengthAwarePaginator<int, Comment>
     */
    public function paginateThread(Commentable $commentable, int $perPage, ?int $userId = null): LengthAwarePaginator
    {
        return Comment::query()
            ->with([
                'author',
                'visibleReplies' => function (Relation $replies) use ($userId): void {
                    $replies->addSelect(['is_reported' => Comment::userReportQuery($userId)]);
                    $replies->with('author');
                },
            ])
            ->withUserReport($userId)
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
            ->with(['author', 'commentable'])
            ->findOrFail($commentId);
    }

    /**
     * @return Collection<int, Comment>
     */
    public function listVisibleReplies(Comment $parent): Collection
    {
        return $parent->visibleReplies()
            ->with('author')
            ->get();
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

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function incrementCommentCount(Commentable $commentable): void
    {
        $commentable::withoutTimestamps(fn () => $commentable->increment('comment_count'));
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function decrementCommentCount(Commentable $commentable): void
    {
        $commentable::withoutTimestamps(fn () => $commentable->decrement('comment_count'));
    }
}
