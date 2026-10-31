<?php

namespace App\Repositories;

use App\Models\ChapterRead;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class ChapterReadRepository
{
    public function createIfAbsent(int $chapterId, ?int $userId, string $sessionKey): bool
    {
        return ChapterRead::query()->insertOrIgnore([
            'chapter_id' => $chapterId,
            'user_id' => $userId,
            'session_key' => $sessionKey,
            'created_at' => now(),
        ]) > 0;
    }

    /**
     * @return LengthAwarePaginator<int, ChapterRead>
     */
    public function paginate(User $reader, int $perPage): LengthAwarePaginator
    {
        return ChapterRead::query()
            ->with(['chapter.novel', 'chapter.author'])
            ->where('user_id', $reader->id)
            ->latest('created_at')
            ->orderByDesc('id')
            ->paginate($perPage);
    }
}
