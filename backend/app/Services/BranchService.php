<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\Novel;
use App\Repositories\ChapterRepository;
use App\Repositories\NovelRepository;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class BranchService
{
    public function __construct(
        private readonly NotificationService $notificationService,
        private readonly ChapterRepository $chaptersR,
        private readonly NovelRepository $novelsR
    ) {}

    public function recomputeBranchLikes(Novel $novel): int
    {
        $previousLastChapter = $this->chaptersR->lastChapterOfMainBranch($novel->id);

        $updatedChapters = $this->recomputeBranchLikeCounts($novel);

        $newLastChapterOfMainBranch = $this->updateLastChapterOfMainBranch($novel);

        if ($newLastChapterOfMainBranch !== null) {
            $this->notificationService->mainBranchSwitch($previousLastChapter, $newLastChapterOfMainBranch);
        }

        return $updatedChapters;
    }

    public function updateLastChapterOfMainBranch(Novel $novel): ?Chapter
    {
        $newLastChapterOfMainBranch = $this->findNewLastChapterOfMainBranch($novel);

        if ($newLastChapterOfMainBranch === null) {
            return null;
        }

        $this->novelsR->setLastChapterOfMainBranch($novel->id, $newLastChapterOfMainBranch->id);

        return $newLastChapterOfMainBranch;
    }

    private function findNewLastChapterOfMainBranch(Novel $novel): ?Chapter
    {
        $mostLikedLastChapter = $this->chaptersR->mostLikedLastChapter($novel->id);

        if ($mostLikedLastChapter === null) {
            return null;
        }

        $lastChapterOfMainBranch = $this->chaptersR->lastChapterOfMainBranch($novel->id);

        if ($lastChapterOfMainBranch !== null && $mostLikedLastChapter->branch_like_count <= $lastChapterOfMainBranch->branch_like_count) {
            return null;
        }

        return $mostLikedLastChapter;
    }

    private function recomputeBranchLikeCounts(Novel $novel): int
    {
        $startedAt = now();

        $chapters = Chapter::query()
            ->where('novel_id', $novel->id)
            ->where('status', '!=', Chapter::STATUS_DRAFT)
            ->orderBy('depth')
            ->get(['id', 'parent_id', 'like_count', 'branch_like_count']);

        $cumulated = [];
        $idsByTotal = [];

        foreach ($chapters as $chapter) {
            $total = ($cumulated[$chapter->parent_id] ?? 0) + $chapter->like_count;
            $cumulated[$chapter->id] = $total;

            if ($total === $chapter->branch_like_count) {
                continue;
            }

            $idsByTotal[$total][] = $chapter->id;
        }

        foreach ($idsByTotal as $total => $ids) {
            Chapter::whereIn('id', $ids)->toBase()->update(['branch_like_count' => $total]);
        }

        Novel::whereKey($novel->id)->update(['branch_recomputed_at' => $startedAt]);

        return array_sum(array_map('count', $idsByTotal));
    }
}
