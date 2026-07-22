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
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'cover_url' => $this->cover_url,
            'is_favorite' => $this->is_favorite,
            'genre' => [
                'id' => $this->genre->id,
                'name' => $this->genre->name,
            ],
        ];
    }
}
