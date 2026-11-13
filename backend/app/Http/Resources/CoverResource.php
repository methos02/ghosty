<?php

namespace App\Http\Resources;

use App\Models\NovelCover;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 *
 * @mixin NovelCover
 */
class CoverResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'novel_id' => $this->novel_id,
            'image_url' => $this->imageUrl(),
            'like_count' => $this->like_count,
            'comment_count' => $this->comment_count,
            'is_liked' => (bool) $this->getAttribute('is_liked'),
            'is_reported' => (bool) $this->getAttribute('is_reported'),
            'is_hidden' => $this->isHidden(),
            'author' => [
                'id' => $this->author_id,
                'username' => $this->whenLoaded('author', fn () => $this->author->username),
            ],
            'novel' => $this->whenLoaded('novel', fn () => [
                'id' => $this->novel->id,
                'slug' => $this->novel->slug,
                'title' => $this->novel->title,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
