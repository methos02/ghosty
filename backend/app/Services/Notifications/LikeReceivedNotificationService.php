<?php

namespace App\Services\Notifications;

use App\Enums\NotificationType;
use App\Helpers\NotificationDataHelper;
use App\Models\Contracts\Likeable;
use App\Models\Notification;
use App\Models\User;
use App\Repositories\LikeRepository;
use App\Services\NotificationService;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
class LikeReceivedNotificationService
{
    public function __construct(
        private readonly NotificationService $notificationService,
        private readonly LikeRepository $likesR
    ) {}

    public function create(Likeable $likeable, User $liker): void
    {
        $this->notificationService->push(
            $likeable->author,
            $liker->id,
            NotificationType::LikeReceived,
            $likeable,
            fn (?Notification $pending): array => [
                ...NotificationDataHelper::contentSubject($likeable),
                'last_actor_username' => $liker->username,
                ...$this->likesSinceFirstUnreadLike($likeable, $liker, $pending),
            ]
        );
    }

    /**
     * @return array{first_like_id: int, count: int}
     */
    private function likesSinceFirstUnreadLike(Likeable $likeable, User $liker, ?Notification $pending): array
    {
        $firstLikeId = $pending === null
            ? $this->likesR->findUserLikeId($liker->id, $likeable)
            : $this->pendingFirstLikeId($pending);

        return [
            'first_like_id' => $firstLikeId,
            'count' => $this->likesR->countLikesSinceLikeId($likeable, $firstLikeId),
        ];
    }

    private function pendingFirstLikeId(Notification $pending): int
    {
        $firstLikeId = $pending->data['first_like_id'] ?? 0;

        return is_int($firstLikeId) ? $firstLikeId : 0;
    }
}
