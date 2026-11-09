<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Enums\ReportResolution;
use App\Helpers\NotificationDataHelper;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Sanction;
use App\Models\User;
use App\Services\NotificationService;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ContentModeratedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    public function create(User $moderator, Chapter|Comment $content, ReportResolution $resolution, ?Sanction $sanction): void
    {
        if ($resolution === ReportResolution::Dismissed && $sanction === null) {
            return;
        }

        $this->notificationService->push(
            $content->author,
            $moderator->id,
            NotificationType::ContentModerated,
            $content,
            fn (): array => [
                ...NotificationDataHelper::moderatedContentData($content, $resolution),
                'sanction' => $sanction === null ? null : [
                    'type' => $sanction->type->value,
                    'until' => $sanction->until?->toIso8601String(),
                    'reason' => $sanction->reason,
                ],
            ]
        );
    }
}
