<?php

namespace App\Services;

use App\Models\NovelCover;
use App\Models\User;
use App\Repositories\NovelCoverRepository;
use Illuminate\Support\Facades\DB;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class CoverLikeService
{
    public function __construct(
        private readonly LikeService $likeService,
        private readonly NovelCoverRepository $novelCoversR,
        private readonly OfficialCoverService $officialCoverService
    ) {}

    public function like(User $user, NovelCover $cover, ?string $ip): ?NovelCover
    {
        $previouslyLikedCover = $this->novelCoversR->findLikedByUser($cover->novel_id, $user->id);

        if ($previouslyLikedCover?->is($cover)) {
            return null;
        }

        DB::transaction(function () use ($user, $cover, $ip, $previouslyLikedCover): void {
            if ($previouslyLikedCover instanceof NovelCover) {
                $this->likeService->unlike($user, $previouslyLikedCover);
            }

            $this->likeService->like($user, $cover, $ip);
        });

        $this->officialCoverService->update($cover->novel_id, $user->id);

        return $previouslyLikedCover;
    }

    public function unlike(User $user, NovelCover $cover): void
    {
        if ($this->likeService->unlike($user, $cover)) {
            $this->officialCoverService->update($cover->novel_id, $user->id);
        }
    }
}
