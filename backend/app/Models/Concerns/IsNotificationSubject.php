<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 *
 * @mixin Model
 */
trait IsNotificationSubject
{
    public function notificationKey(): string
    {
        return $this->getMorphClass().':'.$this->id;
    }
}
