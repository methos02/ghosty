<?php

namespace App\Services;

use App\Enums\NotificationType;
use App\Models\Chapter;
use App\Models\Notification;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\NotificationRepository;
use Closure;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
class NotificationService
{
    public function __construct(
        private readonly NotificationRepository $notificationsR
    ) {}

    /**
     * @param  Closure(?Notification): array<string, mixed>  $data
     */
    public function push(User $recipient, ?int $actorId, NotificationType $type, Chapter|Novel $subject, Closure $data): void
    {
        if ($recipient->id === $actorId || ! $recipient->notifications_enabled) {
            return;
        }

        $groupKey = $type->groupKey($subject);
        $pending = $this->notificationsR->findUnread($recipient, $groupKey);

        $this->notificationsR->saveUnread($recipient, $type, $groupKey, $data($pending));
    }

    public function findUnread(User $recipient, NotificationType $type, Chapter|Novel $subject): ?Notification
    {
        return $this->notificationsR->findUnread($recipient, $type->groupKey($subject));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Notification $notification, array $data): void
    {
        $this->notificationsR->update($notification, $data);
    }

    public function delete(Notification $notification): void
    {
        $this->notificationsR->delete($notification);
    }
}
