<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Helpers\NotificationDataHelper;
use App\Models\Comment;
use App\Models\Contracts\Commentable;
use App\Models\Notification;
use App\Models\User;
use App\Services\NotificationService;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentRepliedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    public function create(Comment $reply, Comment $parent, Commentable $commentable, ?User $mentionedUser = null): void
    {
        $this->notify($parent->author, $reply, $commentable);

        if (! $mentionedUser instanceof User || $mentionedUser->id === $parent->author_id) {
            return;
        }

        $this->notify($mentionedUser, $reply, $commentable);
    }

    private function notify(User $recipient, Comment $reply, Commentable $commentable): void
    {
        $this->notificationService->push(
            $recipient,
            $reply->author_id,
            NotificationType::CommentReplied,
            $commentable,
            fn (?Notification $pending): array => NotificationDataHelper::commentData($reply, $commentable, $pending)
        );
    }
}
