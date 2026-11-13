<?php

namespace App\Enums;

use App\Models\Contracts\NotificationSubject;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
enum NotificationType: string
{
    case ChapterContinued = 'chapter_continued';
    case LikeReceived = 'like_received';
    case MainBranchGained = 'main_branch_gained';
    case MainBranchLost = 'main_branch_lost';
    case FollowedBranchExtended = 'followed_branch_extended';
    case CommentReceived = 'comment_received';
    case CommentReplied = 'comment_replied';
    case ContentModerated = 'content_moderated';
    case ReportProcessed = 'report_processed';
    case CoverSelected = 'cover_selected';

    public function groupKey(NotificationSubject $subject): string
    {
        return $this->value.':'.$subject->notificationKey();
    }
}
