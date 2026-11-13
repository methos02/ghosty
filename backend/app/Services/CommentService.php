<?php

namespace App\Services;

use App\DTO\CommentDTO;
use App\Models\Comment;
use App\Models\Contracts\Commentable;
use App\Models\User;
use App\Repositories\CommentRepository;
use App\Services\Notifications\CommentReceivedNotificationService;
use App\Services\Notifications\CommentRepliedNotificationService;
use Illuminate\Support\Facades\DB;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentService
{
    public function __construct(
        private readonly CommentRepository $commentsR,
        private readonly CommentReceivedNotificationService $commentReceivedNotificationService,
        private readonly CommentRepliedNotificationService $commentRepliedNotificationService
    ) {}

    public function create(User $author, Commentable $commentable, CommentDTO $commentDTO): Comment
    {
        $comment = DB::transaction(function () use ($author, $commentable, $commentDTO): Comment {
            $comment = $this->commentsR->create([
                ...$commentDTO->attributes(),
                'author_id' => $author->id,
                'commentable_type' => $commentable->getMorphClass(),
                'commentable_id' => $commentable->id,
                'status' => Comment::STATUS_VISIBLE,
            ]);

            $this->commentsR->incrementCommentCount($commentable);

            return $comment;
        });

        $this->commentReceivedNotificationService->create($comment, $commentable);

        return $comment;
    }

    public function createReply(User $author, Comment $parent, CommentDTO $commentDTO): Comment
    {
        $commentable = $parent->target();

        $reply = DB::transaction(function () use ($author, $parent, $commentable, $commentDTO): Comment {
            $reply = $this->commentsR->create([
                ...$commentDTO->attributes(),
                'author_id' => $author->id,
                'commentable_type' => $parent->commentable_type,
                'commentable_id' => $parent->commentable_id,
                'parent_id' => $parent->id,
                'status' => Comment::STATUS_VISIBLE,
            ]);

            $this->commentsR->incrementReplyCount($parent);
            $this->commentsR->incrementCommentCount($commentable);

            return $reply;
        });

        $mentionedUserToNotify = $this->findMentionedUser($parent, $reply, $commentDTO->mentionedUserId);

        $this->commentRepliedNotificationService->create($reply, $parent, $commentable, $mentionedUserToNotify);

        return $reply;
    }

    public function delete(Comment $comment): void
    {
        $commentable = $comment->target();

        DB::transaction(function () use ($comment, $commentable): void {
            $this->commentsR->update($comment, [
                'status' => Comment::STATUS_DELETED,
                'content' => null,
            ]);

            $this->commentsR->decrementCommentCount($commentable);

            if ($comment->parent instanceof Comment) {
                $this->commentsR->decrementReplyCount($comment->parent);
            }
        });
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    public function hide(Comment $comment): void
    {
        $commentable = $comment->target();

        DB::transaction(function () use ($comment, $commentable): void {
            $this->commentsR->update($comment, ['status' => Comment::STATUS_HIDDEN]);
            $this->commentsR->decrementCommentCount($commentable);

            if ($comment->parent instanceof Comment) {
                $this->commentsR->decrementReplyCount($comment->parent);
            }
        });
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    public function restore(Comment $comment): void
    {
        $commentable = $comment->target();

        DB::transaction(function () use ($comment, $commentable): void {
            $this->commentsR->update($comment, ['status' => Comment::STATUS_VISIBLE]);
            $this->commentsR->incrementCommentCount($commentable);

            if ($comment->parent instanceof Comment) {
                $this->commentsR->incrementReplyCount($comment->parent);
            }
        });
    }

    private function findMentionedUser(Comment $parent, Comment $reply, ?int $mentionedUserId): ?User
    {
        if ($mentionedUserId === null) {
            return null;
        }

        return $this->commentsR->listVisibleReplies($parent)
            ->reject(fn (Comment $sibling): bool => $sibling->is($reply))
            ->map(fn (Comment $sibling): User => $sibling->author)
            ->first(fn (User $participant): bool => $participant->id === $mentionedUserId && $reply->startsWithMentionOf($participant));
    }
}
