<?php

namespace App\Repositories;

use App\Models\Chapter;
use App\Models\ReadingProgress;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class ReadingProgressRepository
{
    public function save(int $userId, Chapter $chapter, CarbonInterface $readAt): void
    {
        ReadingProgress::query()->updateOrCreate(
            [
                'user_id' => $userId,
                'novel_id' => $chapter->novel_id,
            ],
            [
                'chapter_id' => $chapter->id,
                'read_at' => $readAt,
            ]
        );
    }

    /**
     * @return LengthAwarePaginator<int, ReadingProgress>
     */
    public function paginate(User $reader, int $perPage): LengthAwarePaginator
    {
        return ReadingProgress::query()
            ->with(['chapter.novel', 'chapter.author'])
            ->where('user_id', $reader->id)
            ->latest('read_at')
            ->orderByDesc('id')
            ->paginate($perPage);
    }
}
