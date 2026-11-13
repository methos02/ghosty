<?php

namespace App\Services;

use App\Models\Contracts\Likeable;
use App\Models\User;
use App\Repositories\LikeRepository;
use App\Services\Notifications\LikeReceivedNotificationService;
use Illuminate\Support\Facades\DB;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class LikeService
{
    public function __construct(
        private readonly LikeRepository $likesR,
        private readonly LikeReceivedNotificationService $likeReceivedNotificationService
    ) {}

    public function like(User $user, Likeable $likeable, ?string $ip): bool
    {
        $isNewLike = DB::transaction(function () use ($user, $likeable, $ip): bool {
            if (! $this->likesR->createIfAbsent($user->id, $likeable, $ip)) {
                return false;
            }

            $this->likesR->incrementLikeCount($likeable);

            return true;
        });

        if ($isNewLike) {
            $this->likeReceivedNotificationService->create($likeable, $user);
        }

        return $isNewLike;
    }

    public function unlike(User $user, Likeable $likeable): bool
    {
        return DB::transaction(function () use ($user, $likeable): bool {
            if (! $this->likesR->delete($user->id, $likeable)) {
                return false;
            }

            $this->likesR->decrementLikeCount($likeable);

            return true;
        });
    }
}
