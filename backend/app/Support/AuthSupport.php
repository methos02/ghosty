<?php

namespace App\Support;

use Illuminate\Support\Facades\Auth;

/**
 * @see memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
 */
final class AuthSupport
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
