<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Services\NotificationService;
use App\Support\NotificationDataSupport;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
class ChapterContinuedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    public function create(Chapter $continuation, Chapter $parent): void
    {
        $this->notificationService->push(
            $parent->author,
            $continuation->author_id,
            NotificationType::ChapterContinued,
            $parent,
            fn (?Notification $pending): array => [
                ...NotificationDataSupport::chapterSubject($parent),
                'continuation' => [
                    'id' => $continuation->id,
                    'title' => $continuation->title,
                    'author_username' => $continuation->author->username,
                ],
                'count' => NotificationDataSupport::pendingCount($pending) + 1,
            ]
        );
    }
}
