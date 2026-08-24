<?php

namespace App\Console\Commands;

use App\Models\Novel;
use App\Services\BranchService;
use Illuminate\Console\Command;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class RecomputeBranchLikeCountsCommand extends Command
{
    protected $signature = 'ghosty:recompute-branch-likes';

    protected $description = 'Recompute branch_like_count for novels touched since their last pass';

    public function handle(BranchService $branchService): int
    {
        $novels = 0;
        $chapters = 0;

        Novel::query()
            ->where(function (Builder $query): void {
                $query->whereNull('branch_recomputed_at')
                    ->orWhereHas('chapters', function (Builder $chapter): void {
                        $chapter->whereColumn('chapters.updated_at', '>=', 'novels.branch_recomputed_at');
                    });
            })
            ->chunkById(50, function (Collection $touched) use ($branchService, &$novels, &$chapters): void {
                foreach ($touched as $novel) {
                    $chapters += $branchService->recompute($novel);
                    $novels++;
                }
            });

        $this->info("{$novels} novel(s) recomputed, {$chapters} chapter(s) updated.");

        return self::SUCCESS;
    }
}
