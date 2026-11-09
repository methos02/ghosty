<?php

namespace App\Enums;

use App\Models\Chapter;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
enum ReportResolution: string
{
    case Dismissed = 'dismissed';
    case Archived = 'archived';
    case Hidden = 'hidden';
    case PassageRemoved = 'passage_removed';

    /**
     * @return list<self>
     */
    public static function allowedForChapter(Chapter $chapter): array
    {
        if ($chapter->isRemovableByModeration()) {
            return self::cases();
        }

        return [self::Dismissed, self::PassageRemoved];
    }

    /**
     * @return list<self>
     */
    public static function allowedForComment(): array
    {
        return [self::Dismissed, self::Hidden];
    }
}
