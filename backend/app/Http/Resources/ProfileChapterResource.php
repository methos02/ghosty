<?php

namespace App\Http\Resources;

use App\Models\Chapter;

/**
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 *
 * @mixin Chapter
 */
class ProfileChapterResource extends ChapterResource
{
    /**
     * @return array<string, mixed>
     */
    protected function detailAttributes(): array
    {
        return [
            'read_count' => $this->read_count,
            'is_in_main_branch' => $this->isInMainBranch(),
        ];
    }
}
