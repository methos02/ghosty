<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\Novel;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class BranchService
{
    public function recompute(Novel $novel): int
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
