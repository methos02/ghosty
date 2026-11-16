<?php

namespace App\Enums;

use App\Models\Chapter;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
enum ReportResolution: string
{
    case Dismissed = 'dismissed';
    case Hidden = 'hidden';
    case PassageRemoved = 'passage_removed';
    case Sanctioned = 'sanctioned';

    /**
     * @return list<self>
     */
    public static function allowedForChapter(Chapter $chapter): array
    {
        if ($chapter->isRemovableByModeration()) {
            return [self::Dismissed, self::Hidden, self::PassageRemoved];
        }

        return [self::Dismissed, self::PassageRemoved];
    }

    /**
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     *
     * @return list<self>
     */
    public static function allowedForCover(): array
    {
        return [self::Dismissed, self::Hidden];
    }

    /**
     * @return list<self>
     */
    public static function allowedForComment(): array
    {
        return [self::Dismissed, self::Hidden];
    }

    /**
     * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
     *
     * @return list<self>
     */
    public static function allowedForUser(): array
    {
        return [self::Dismissed, self::Sanctioned];
    }
}
