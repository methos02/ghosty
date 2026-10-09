<?php

namespace App\Repositories;

use App\Enums\NotificationType;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
class NotificationRepository
{
    public function findUnread(User $recipient, string $groupKey): ?Notification
    {
        return $this->notificationsByRecipient($recipient)
            ->where('group_key', $groupKey)
            ->whereNull('read_at')
            ->first();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function saveUnread(User $recipient, NotificationType $type, string $groupKey, array $data): Notification
    {
        return Notification::query()->updateOrCreate(
            [
                'notifiable_type' => $recipient->getMorphClass(),
                'notifiable_id' => $recipient->id,
                'group_key' => $groupKey,
                'read_at' => null,
            ],
            [
                'type' => $type->value,
                'data' => $data,
                'updated_at' => now(),
            ]
        );
    }

    /**
     * @return LengthAwarePaginator<int, Notification>
     */
    public function paginate(User $recipient, int $perPage): LengthAwarePaginator
    {
        return $this->notificationsByRecipient($recipient)
            ->latest('updated_at')
            ->paginate($perPage);
    }

    public function unreadCount(User $recipient): int
    {
        return $this->notificationsByRecipient($recipient)->whereNull('read_at')->count();
    }

    public function find(User $recipient, string $notificationId): Notification
    {
        return $this->notificationsByRecipient($recipient)->whereKey($notificationId)->firstOrFail();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Notification $notification, array $data): void
    {
        Notification::query()
            ->whereKey($notification->id)
            ->toBase()
            ->update(['data' => json_encode($data, JSON_THROW_ON_ERROR)]);
    }

    public function delete(Notification $notification): void
    {
        Notification::query()->whereKey($notification->id)->delete();
    }

    public function markAsRead(Notification $notification): void
    {
        Notification::query()
            ->whereKey($notification->id)
            ->whereNull('read_at')
            ->toBase()
            ->update(['read_at' => now()]);
    }

    public function markAllAsRead(User $recipient): void
    {
        $this->notificationsByRecipient($recipient)
            ->whereNull('read_at')
            ->toBase()
            ->update(['read_at' => now()]);
    }

    /**
     * @return Builder<Notification>
     */
    private function notificationsByRecipient(User $recipient): Builder
    {
        return Notification::query()
            ->where('notifiable_type', $recipient->getMorphClass())
            ->where('notifiable_id', $recipient->id);
    }
}
