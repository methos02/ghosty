<?php

namespace App\Http\Resources;

use App\Models\Chapter;
use Illuminate\Http\Request;

/**
 * @mixin Chapter
 */
class ChapterListResource extends ChapterResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $attributes = parent::toArray($request);

        unset($attributes['content']);

        return $attributes;
    }
}
