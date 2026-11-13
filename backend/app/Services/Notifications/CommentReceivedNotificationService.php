<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Helpers\NotificationDataHelper;
use App\Models\Comment;
use App\Models\Contracts\Commentable;
use App\Models\Notification;
use App\Services\NotificationService;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentReceivedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    public function create(Comment $comment, Commentable $commentable): void
    {
        $this->notificationService->push(
            $commentable->author,
            $comment->author_id,
            NotificationType::CommentReceived,
            $commentable,
            fn (?Notification $pending): array => NotificationDataHelper::commentData($comment, $commentable, $pending)
        );
    }
}
