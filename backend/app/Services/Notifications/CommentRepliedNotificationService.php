<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\Novel;
use App\Services\NotificationService;
use App\Support\NotificationDataSupport;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentRepliedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    public function create(Comment $reply, Comment $parent, Chapter|Novel $commentable): void
    {
        $this->notificationService->push(
            $parent->author,
            $reply->author_id,
            NotificationType::CommentReplied,
            $commentable,
            fn (?Notification $pending): array => NotificationDataSupport::commentData($reply, $commentable, $pending)
        );
    }
}
