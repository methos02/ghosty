<?php

namespace App\Repositories;

use App\Models\Like;
use Illuminate\Database\Eloquent\Model;

class LikeRepository
{
    public function createIfAbsent(int $userId, Model $likeable, ?string $ip): bool
    {
        return Like::query()->insertOrIgnore([
            'user_id' => $userId,
            'likeable_type' => $likeable->getMorphClass(),
            'likeable_id' => $likeable->getKey(),
            'created_ip' => $ip,
            'created_at' => now(),
        ]) > 0;
    }

    public function deleteFor(int $userId, Model $likeable): bool
    {
        return Like::query()
            ->where('user_id', $userId)
            ->where('likeable_type', $likeable->getMorphClass())
            ->where('likeable_id', $likeable->getKey())
            ->delete() > 0;
    }
}
