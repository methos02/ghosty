<?php

namespace App\Repositories;

use App\Models\ChapterVersion;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ChapterVersionRepository
{
    public function create(int $chapterId, int $moderatorId, string $content): ChapterVersion
    {
        return ChapterVersion::create([
            'chapter_id' => $chapterId,
            'moderator_id' => $moderatorId,
            'content' => $content,
        ]);
    }
}
