<?php

namespace App\Repositories;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class FollowRepository
{
    public function createIfAbsent(int $userId, int $chapterId): bool
    {
        return Follow::query()->insertOrIgnore([
            'user_id' => $userId,
            'chapter_id' => $chapterId,
            'created_at' => now(),
        ]) > 0;
    }

    public function delete(int $userId, int $chapterId): bool
    {
        return Follow::query()
            ->where('user_id', $userId)
            ->where('chapter_id', $chapterId)
            ->delete() > 0;
    }

    /**
     * @return LengthAwarePaginator<int, Follow>
     */
    public function paginate(User $follower, int $perPage): LengthAwarePaginator
    {
        return Follow::query()
            ->with(['chapter.novel', 'chapter.author'])
            ->where('user_id', $follower->id)
            ->latest('created_at')
            ->orderByDesc('id')
            ->paginate($perPage);
    }
}
