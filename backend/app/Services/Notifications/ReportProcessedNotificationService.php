<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Enums\ReportResolution;
use App\Helpers\NotificationDataHelper;
use App\Models\Contracts\Reportable;
use App\Models\Report;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Support\Collection;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ReportProcessedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    /**
     * @param  Collection<int, Report>  $reports
     */
    public function create(User $moderator, Reportable $content, ReportResolution $resolution, Collection $reports): void
    {
        foreach ($reports as $report) {
            $this->notificationService->push(
                $report->reporter,
                $moderator->id,
                NotificationType::ReportProcessed,
                $content,
                fn (): array => NotificationDataHelper::moderatedContentData($content, $resolution)
            );
        }
    }
}
