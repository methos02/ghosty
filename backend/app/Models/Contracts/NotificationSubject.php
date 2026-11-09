<?php

namespace App\Models\Contracts;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
interface NotificationSubject
{
    public function notificationKey(): string;
}
