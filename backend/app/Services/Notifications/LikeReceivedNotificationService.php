<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Models\User;
use App\Repositories\LikeRepository;
use App\Services\NotificationService;
use App\Support\NotificationDataSupport;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
class LikeReceivedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService,
        private readonly LikeRepository $likesR
    ) {}

    public function create(Chapter $chapter, User $liker): void
    {
        $this->notificationService->push(
            $chapter->author,
            $liker->id,
            NotificationType::LikeReceived,
            $chapter,
            fn (?Notification $pending): array => [
                ...NotificationDataSupport::chapterSubject($chapter),
                'last_actor_username' => $liker->username,
                ...$this->likesSinceFirstUnreadLike($chapter, $liker, $pending),
            ]
        );
    }

    /**
     * @return array{first_like_id: int, count: int}
     */
    private function likesSinceFirstUnreadLike(Chapter $chapter, User $liker, ?Notification $pending): array
    {
        $firstLikeId = $pending === null
            ? $this->likesR->findUserLikeId($liker->id, $chapter)
            : $this->pendingFirstLikeId($pending);

        return [
            'first_like_id' => $firstLikeId,
            'count' => $this->likesR->countLikesSinceLikeId($chapter, $firstLikeId),
        ];
    }

    private function pendingFirstLikeId(Notification $pending): int
    {
        $firstLikeId = $pending->data['first_like_id'] ?? 0;

        return is_int($firstLikeId) ? $firstLikeId : 0;
    }
}
