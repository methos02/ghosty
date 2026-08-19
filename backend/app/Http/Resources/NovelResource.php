<?php

namespace App\Http\Resources;

use App\Models\Novel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Novel
 */
class NovelResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'cover_url' => $this->coverUrl(),
            'is_favorite' => $this->is_favorite,
            'chapters_count' => $this->chapter_count,
            'author' => [
                'id' => $this->author_id,
                'username' => $this->whenLoaded('author', fn () => $this->author->username),
            ],
            'genre' => [
                'id' => $this->genre_id,
                'name' => $this->whenLoaded('genre', fn () => $this->genre->name),
            ],
        ];
    }
}
