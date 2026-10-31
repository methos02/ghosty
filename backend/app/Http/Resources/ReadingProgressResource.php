<?php

namespace App\Http\Resources;

use App\Models\ReadingProgress;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 *
 * @mixin ReadingProgress
 */
class ReadingProgressResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'chapter' => new ChapterListResource($this->chapter),
            'read_at' => $this->read_at->toIso8601String(),
        ];
    }
}
