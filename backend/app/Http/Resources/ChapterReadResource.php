<?php

namespace App\Http\Resources;

use App\Models\ChapterRead;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 *
 * @mixin ChapterRead
 */
class ChapterReadResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'chapter' => new ChapterListResource($this->chapter),
            'read_at' => $this->created_at->toIso8601String(),
        ];
    }
}
