<?php

namespace App\Models;

use Database\Factories\NotificationFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\DatabaseNotification;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 *
 * @mixin IdeHelperNotification
 */
class Notification extends DatabaseNotification
{
    /** @use HasFactory<NotificationFactory> */
    use HasFactory, HasUuids;
}
