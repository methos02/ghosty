<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

/**
 * @see memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
 */
final class CurrentUserHelper
{
    public function id(): ?int
    {
        $authId = Auth::guard('sanctum')->id();

        if ($authId === null) {
            return null;
        }

        return (int) $authId;
    }
}
