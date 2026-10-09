<?php

namespace App\Http\Resources;

use App\Models\Chapter;

/**
 * @mixin Chapter
 */
class ChapterListResource extends ChapterResource
{
    /**
     * @return array<string, mixed>
     */
    protected function detailAttributes(): array
    {
        return [];
    }
}
