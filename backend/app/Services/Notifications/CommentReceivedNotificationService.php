<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Helpers\NotificationDataHelper;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\Novel;
use App\Services\NotificationService;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentReceivedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    public function create(Comment $comment, Chapter|Novel $commentable): void
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
