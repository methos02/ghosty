<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Models\Novel;
use App\Repositories\ChapterRepository;
use App\Services\NotificationService;
use App\Support\NotificationDataSupport;
use Illuminate\Support\Collection;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class MainBranchSwitchNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService,
        private readonly ChapterRepository $chaptersR
    ) {}

    public function create(?Chapter $previousLastChapter, Chapter $newLastChapter): void
    {
        $novel = $newLastChapter->novel;
        $newBranchIds = $newLastChapter->pathChapterIds();
        $previousBranchIds = $previousLastChapter?->pathChapterIds() ?? [];

        $joiningChapters = $this->chaptersR->findByIds(array_values(array_diff($newBranchIds, $previousBranchIds)));
        $leavingChapters = $this->chaptersR->findByIds(array_values(array_diff($previousBranchIds, $newBranchIds)));

        foreach ($joiningChapters->groupBy('author_id') as $authorChapters) {
            $this->addToUnreadBranchNotification(NotificationType::MainBranchGained, $novel, $authorChapters);
            $this->removeFromUnreadBranchNotification(NotificationType::MainBranchLost, $novel, $authorChapters);
        }

        foreach ($leavingChapters->groupBy('author_id') as $authorChapters) {
            $this->addToUnreadBranchNotification(NotificationType::MainBranchLost, $novel, $authorChapters);
            $this->removeFromUnreadBranchNotification(NotificationType::MainBranchGained, $novel, $authorChapters);
        }
    }

    /**
     * @param  Collection<int, Chapter>  $authorChapters
     */
    private function addToUnreadBranchNotification(NotificationType $type, Novel $novel, Collection $authorChapters): void
    {
        $this->notificationService->push(
            $authorChapters->firstOrFail()->author,
            null,
            $type,
            $novel,
            fn (?Notification $pending): array => NotificationDataSupport::novelChaptersData($novel, NotificationDataSupport::mergeChapterSummaries(
                NotificationDataSupport::pendingChapterSummaries($pending),
                NotificationDataSupport::chapterSummaries($authorChapters)
            ))
        );
    }

    /**
     * @param  Collection<int, Chapter>  $authorChapters
     */
    private function removeFromUnreadBranchNotification(NotificationType $type, Novel $novel, Collection $authorChapters): void
    {
        $pending = $this->notificationService->findUnread($authorChapters->firstOrFail()->author, $type, $novel);

        if ($pending === null) {
            return;
        }

        $withdrawnIds = $authorChapters->pluck('id')->all();
        $remainingChapters = array_values(array_filter(
            NotificationDataSupport::pendingChapterSummaries($pending),
            fn (array $chapter): bool => ! in_array($chapter['id'], $withdrawnIds, true)
        ));

        if ($remainingChapters === []) {
            $this->notificationService->delete($pending);

            return;
        }

        $this->notificationService->update($pending, NotificationDataSupport::novelChaptersData($novel, $remainingChapters));
    }
}
