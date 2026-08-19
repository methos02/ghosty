<?php

namespace App\Services;

use App\Models\Chapter;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class BranchService
{
    public function applyLike(Chapter $chapter, int $delta = 1): void
    {
        $chapter->increment('like_count', $delta);

        Chapter::where('path', 'like', $chapter->path.'%')
            ->increment('branch_like_count', $delta);
    }
}
