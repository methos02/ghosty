<?php

namespace App\Services;

use App\Models\NovelCover;
use App\Repositories\NovelCoverRepository;
use App\Repositories\NovelRepository;
use App\Services\Notifications\CoverSelectedNotificationService;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class OfficialCoverService
{
    public function __construct(
        private readonly NovelCoverRepository $novelCoversR,
        private readonly NovelRepository $novelsR,
        private readonly CoverSelectedNotificationService $coverSelectedNotificationService
    ) {}

    public function update(int $novelId, ?int $actorId): void
    {
        $storedOfficialCoverId = $this->novelsR->findOfficialCoverId($novelId);
        $newOfficialCover = $this->findNewOfficialCover($novelId, $storedOfficialCoverId);

        if ($newOfficialCover?->id === $storedOfficialCoverId) {
            return;
        }

        $this->novelsR->setOfficialCover($novelId, $newOfficialCover?->id);

        if ($newOfficialCover instanceof NovelCover) {
            $this->coverSelectedNotificationService->create($newOfficialCover, $actorId);
        }
    }

    private function findNewOfficialCover(int $novelId, ?int $storedOfficialCoverId): ?NovelCover
    {
        $mostLikedCover = $this->novelCoversR->findMostLikedPublished($novelId);
        $currentOfficialCover = $storedOfficialCoverId === null ? null : $this->novelCoversR->findPublished($storedOfficialCoverId);

        if ($mostLikedCover === null || $currentOfficialCover === null) {
            return $mostLikedCover;
        }

        if ($mostLikedCover->like_count > $currentOfficialCover->like_count) {
            return $mostLikedCover;
        }

        return $currentOfficialCover;
    }
}
