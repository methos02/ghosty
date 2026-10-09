<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\User;
use App\Repositories\LikeRepository;
use Illuminate\Support\Facades\DB;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class LikeService
{
    public function __construct(
        private readonly LikeRepository $likesR,
        private readonly NotificationService $notificationService
    ) {}

    public function like(User $user, Chapter $chapter, ?string $ip): bool
    {
        $isNewLike = DB::transaction(function () use ($user, $chapter, $ip): bool {
            if (! $this->likesR->createIfAbsent($user->id, $chapter, $ip)) {
                return false;
            }

            $chapter->increment('like_count');

            return true;
        });

        if ($isNewLike) {
            $this->notificationService->likeReceived($chapter, $user);
        }

        return $isNewLike;
    }

    public function unlike(User $user, Chapter $chapter): bool
    {
        return DB::transaction(function () use ($user, $chapter): bool {
            if (! $this->likesR->deleteFor($user->id, $chapter)) {
                return false;
            }

            $chapter->decrement('like_count');

            return true;
        });
    }
}
