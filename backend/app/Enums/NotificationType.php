<?php

namespace App\Enums;

use App\Models\Chapter;
use App\Models\Novel;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
enum NotificationType: string
{
    case ChapterContinued = 'chapter_continued';
    case LikeReceived = 'like_received';
    case MainBranchGained = 'main_branch_gained';
    case MainBranchLost = 'main_branch_lost';

    public function groupKey(Chapter|Novel $subject): string
    {
        return $this->value.':'.$subject->getMorphClass().':'.$subject->id;
    }
}
