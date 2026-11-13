<?php

namespace App\Repositories;

use App\Models\Contracts\Likeable;
use App\Models\Like;

class LikeRepository
{
    public function createIfAbsent(int $userId, Likeable $likeable, ?string $ip): bool
    {
        return Like::query()->insertOrIgnore([
            'user_id' => $userId,
            'likeable_type' => $likeable->getMorphClass(),
            'likeable_id' => $likeable->getKey(),
            'created_ip' => $ip,
            'created_at' => now(),
        ]) > 0;
    }

    public function findUserLikeId(int $userId, Likeable $likeable): int
    {
        return Like::query()
            ->where('user_id', $userId)
            ->where('likeable_type', $likeable->getMorphClass())
            ->where('likeable_id', $likeable->getKey())
            ->firstOrFail(['id'])
            ->id;
    }

    public function countLikesSinceLikeId(Likeable $likeable, int $likeId): int
    {
        return Like::query()
            ->where('likeable_type', $likeable->getMorphClass())
            ->where('likeable_id', $likeable->getKey())
            ->where('id', '>=', $likeId)
            ->count();
    }

    public function deleteAllOnLikeable(Likeable $likeable): void
    {
        Like::query()
            ->where('likeable_type', $likeable->getMorphClass())
            ->where('likeable_id', $likeable->getKey())
            ->delete();
    }

    public function delete(int $userId, Likeable $likeable): bool
    {
        return Like::query()
            ->where('user_id', $userId)
            ->where('likeable_type', $likeable->getMorphClass())
            ->where('likeable_id', $likeable->getKey())
            ->delete() > 0;
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function incrementLikeCount(Likeable $likeable): void
    {
        $likeable->increment('like_count');
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function decrementLikeCount(Likeable $likeable): void
    {
        $likeable->decrement('like_count');
    }
}
