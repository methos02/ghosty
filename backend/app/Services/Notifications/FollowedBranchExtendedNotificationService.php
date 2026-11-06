<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Repositories\UserRepository;
use App\Services\NotificationService;
use App\Support\NotificationDataSupport;
use Illuminate\Support\Collection;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class FollowedBranchExtendedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService,
        private readonly UserRepository $usersR
    ) {}

    public function create(Chapter $continuation, Chapter $parent): void
    {
        $novel = $continuation->novel;
        $continuationSummaries = NotificationDataSupport::chapterSummaries(new Collection([$continuation]));

        foreach ($this->usersR->followersOfChapters($parent->pathChapterIds()) as $follower) {
            if ($follower->id === $parent->author_id) {
                continue;
            }

            $this->notificationService->push(
                $follower,
                $continuation->author_id,
                NotificationType::FollowedBranchExtended,
                $novel,
                fn (?Notification $pending): array => NotificationDataSupport::novelChaptersData($novel, NotificationDataSupport::mergeChapterSummaries(
                    NotificationDataSupport::pendingChapterSummaries($pending),
                    $continuationSummaries
                ))
            );
        }
    }
}
