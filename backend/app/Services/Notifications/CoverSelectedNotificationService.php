<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Helpers\NotificationDataHelper;
use App\Models\NovelCover;
use App\Services\NotificationService;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class CoverSelectedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    public function create(NovelCover $officialCover, ?int $actorId): void
    {
        $this->notificationService->push(
            $officialCover->author,
            $actorId,
            NotificationType::CoverSelected,
            $officialCover,
            fn (): array => NotificationDataHelper::coverSubject($officialCover)
        );
    }
}
