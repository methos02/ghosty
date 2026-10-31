<?php

namespace App\Services;

use App\Models\Chapter;
use App\Repositories\ChapterReadRepository;
use App\Repositories\ChapterRepository;
use App\Repositories\ReadingProgressRepository;
use Illuminate\Support\Facades\DB;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class ReadingService
{
    public function __construct(
        private readonly ChapterReadRepository $chapterReadsR,
        private readonly ReadingProgressRepository $readingProgressesR,
        private readonly ChapterRepository $chaptersR
    ) {}

    public function registerRead(Chapter $chapter, ?int $readerId, string $sessionKey): void
    {
        if (! $chapter->isPublished()) {
            return;
        }

        DB::transaction(function () use ($chapter, $readerId, $sessionKey): void {
            if ($this->chapterReadsR->createIfAbsent($chapter->id, $readerId, $sessionKey)) {
                $this->chaptersR->incrementReadCount($chapter);
            }

            if ($readerId !== null) {
                $this->readingProgressesR->save($readerId, $chapter, now());
            }
        });
    }
}
