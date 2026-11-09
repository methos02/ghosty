<?php

namespace App\Enums;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
enum SanctionType: string
{
    case Warning = 'warning';
    case WriteBan = 'write_ban';
    case CommentBan = 'comment_ban';
    case AccountBan = 'account_ban';

    public function isBan(): bool
    {
        return $this !== self::Warning;
    }
}
