<?php

namespace App\Services;

use App\DTO\ModerationDecisionDTO;
use App\DTO\SanctionDTO;
use App\Enums\ReportResolution;
use App\Enums\SanctionType;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Contracts\Reportable;
use App\Models\NovelCover;
use App\Models\Report;
use App\Models\Sanction;
use App\Models\User;
use App\Repositories\ReportRepository;
use App\Repositories\SanctionRepository;
use App\Repositories\UserRepository;
use App\Services\Notifications\ContentModeratedNotificationService;
use App\Services\Notifications\ReportProcessedNotificationService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ModerationService
{
    public function __construct(
        private readonly ReportRepository $reportsR,
        private readonly SanctionRepository $sanctionsR,
        private readonly UserRepository $usersR,
        private readonly ChapterService $chapterService,
        private readonly CommentService $commentService,
        private readonly CoverService $coverService,
        private readonly ContentModeratedNotificationService $contentModeratedNotificationService,
        private readonly ReportProcessedNotificationService $reportProcessedNotificationService
    ) {}

    /**
     * @param  Collection<int, Report>  $pendingReports
     */
    public function moderateChapter(User $moderator, Chapter $chapter, Collection $pendingReports, ModerationDecisionDTO $decisionDTO): void
    {
        $sanction = DB::transaction(function () use ($moderator, $chapter, $pendingReports, $decisionDTO): ?Sanction {
            $this->applyToChapter($moderator, $chapter, $decisionDTO);

            return $this->close($moderator, $chapter->author_id, $pendingReports, $decisionDTO);
        });

        $this->notify($moderator, $chapter, $pendingReports, $decisionDTO->resolution, $sanction);
    }

    /**
     * @param  Collection<int, Report>  $pendingReports
     */
    public function moderateComment(User $moderator, Comment $comment, Collection $pendingReports, ModerationDecisionDTO $decisionDTO): void
    {
        $sanction = DB::transaction(function () use ($moderator, $comment, $pendingReports, $decisionDTO): ?Sanction {
            if ($decisionDTO->resolution === ReportResolution::Hidden) {
                $this->commentService->hide($comment);
            }

            return $this->close($moderator, $comment->author_id, $pendingReports, $decisionDTO);
        });

        $this->notify($moderator, $comment, $pendingReports, $decisionDTO->resolution, $sanction);
    }

    /**
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     *
     * @param  Collection<int, Report>  $pendingReports
     */
    public function moderateCover(User $moderator, NovelCover $cover, Collection $pendingReports, ModerationDecisionDTO $decisionDTO): void
    {
        $sanction = DB::transaction(function () use ($moderator, $cover, $pendingReports, $decisionDTO): ?Sanction {
            if ($decisionDTO->resolution === ReportResolution::Hidden) {
                $this->coverService->hide($cover);
            }

            return $this->close($moderator, $cover->author_id, $pendingReports, $decisionDTO);
        });

        $this->notify($moderator, $cover, $pendingReports, $decisionDTO->resolution, $sanction);
    }

    public function restoreCover(NovelCover $cover): void
    {
        $this->coverService->restore($cover);
    }

    public function restoreChapter(Chapter $chapter): void
    {
        $this->chapterService->restore($chapter);
    }

    public function restoreComment(Comment $comment): void
    {
        $this->commentService->restore($comment);
    }

    private function applyToChapter(User $moderator, Chapter $chapter, ModerationDecisionDTO $decisionDTO): void
    {
        if ($decisionDTO->resolution === ReportResolution::Archived) {
            $this->chapterService->removeFromReading($chapter, Chapter::STATUS_ARCHIVED);

            return;
        }

        if ($decisionDTO->resolution === ReportResolution::Hidden) {
            $this->chapterService->removeFromReading($chapter, Chapter::STATUS_HIDDEN);

            return;
        }

        if ($decisionDTO->resolution !== ReportResolution::PassageRemoved) {
            return;
        }

        if ($decisionDTO->contentAfterRemoval === null) {
            throw new LogicException('A passage removal requires the content after removal.');
        }

        $this->chapterService->removePassages($chapter, $moderator, $decisionDTO->contentAfterRemoval);
    }

    /**
     * @param  Collection<int, Report>  $pendingReports
     */
    private function close(User $moderator, int $authorId, Collection $pendingReports, ModerationDecisionDTO $decisionDTO): ?Sanction
    {
        $this->reportsR->markProcessed($pendingReports, $moderator->id, $decisionDTO->resolution);

        if ($decisionDTO->sanction === null) {
            return null;
        }

        $sanction = $this->sanctionsR->create([
            ...$decisionDTO->sanction->attributes(),
            'user_id' => $authorId,
            'moderator_id' => $moderator->id,
            'report_id' => $pendingReports->first()?->id,
            'until' => $this->sanctionEnd($decisionDTO->sanction),
        ]);

        if ($sanction->type === SanctionType::AccountBan) {
            $this->usersR->deleteTokens($authorId);
        }

        return $sanction;
    }

    private function sanctionEnd(SanctionDTO $sanctionDTO): ?Carbon
    {
        if (! $sanctionDTO->type->isBan() || $sanctionDTO->days === null) {
            return null;
        }

        return now()->addDays($sanctionDTO->days);
    }

    /**
     * @param  Collection<int, Report>  $pendingReports
     */
    private function notify(User $moderator, Reportable $content, Collection $pendingReports, ReportResolution $resolution, ?Sanction $sanction): void
    {
        $this->contentModeratedNotificationService->create($moderator, $content, $resolution, $sanction);
        $this->reportProcessedNotificationService->create($moderator, $content, $resolution, $pendingReports);
    }
}
