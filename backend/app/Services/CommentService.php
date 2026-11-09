<?php

namespace App\Services;

use App\DTO\CommentDTO;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\CommentRepository;
use App\Repositories\NovelRepository;
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
        private readonly ChapterRepository $chaptersR,
        private readonly NovelRepository $novelsR,
        private readonly CommentReceivedNotificationService $commentReceivedNotificationService,
        private readonly CommentRepliedNotificationService $commentRepliedNotificationService
    ) {}

    public function create(User $author, Chapter|Novel $commentable, CommentDTO $commentDTO): Comment
    {
        $comment = DB::transaction(function () use ($author, $commentable, $commentDTO): Comment {
            $comment = $this->commentsR->create([
                ...$commentDTO->attributes(),
                'author_id' => $author->id,
                'commentable_type' => $commentable->getMorphClass(),
                'commentable_id' => $commentable->id,
                'status' => Comment::STATUS_VISIBLE,
            ]);

            $this->incrementCommentCount($commentable);

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
            $this->incrementCommentCount($commentable);

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

            $this->decrementCommentCount($commentable);

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
            $this->decrementCommentCount($commentable);

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
            $this->incrementCommentCount($commentable);

            if ($comment->parent instanceof Comment) {
                $this->commentsR->incrementReplyCount($comment->parent);
            }
        });
    }

    public function findCommentCount(Chapter|Novel $commentable): int
    {
        if ($commentable instanceof Chapter) {
            return $this->chaptersR->findCommentCount($commentable);
        }

        return $this->novelsR->findCommentCount($commentable);
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

    private function incrementCommentCount(Chapter|Novel $commentable): void
    {
        if ($commentable instanceof Chapter) {
            $this->chaptersR->incrementCommentCount($commentable);

            return;
        }

        $this->novelsR->incrementCommentCount($commentable);
    }

    private function decrementCommentCount(Chapter|Novel $commentable): void
    {
        if ($commentable instanceof Chapter) {
            $this->chaptersR->decrementCommentCount($commentable);

            return;
        }

        $this->novelsR->decrementCommentCount($commentable);
    }
}
