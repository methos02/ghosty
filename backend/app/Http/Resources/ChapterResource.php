<?php

namespace App\Http\Resources;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Chapter
 */
class ChapterResource extends JsonResource
{
    /**
     * @see memory-bank/decisions/ADR-07-modele-multivers-arbre-de-chapitres.md
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'novel_id' => $this->novel_id,
            'parent_id' => $this->parent_id,
            'title' => $this->title,
            'summary' => $this->summary,
            'content' => $this->content,
            'depth' => $this->depth,
            'has_children' => $this->hasChildren(),
            'children_count' => $this->continuations_count,
            'like_count' => $this->like_count,
            'branch_like_count' => $this->branch_like_count,
            'is_liked' => $this->isLikedByViewer(),
            'comment_count' => $this->comment_count,
            'status' => $this->status,
            'is_draft' => $this->isDraft(),
            'is_correctable' => $this->isCorrectable(),
            'is_root' => $this->isRoot(),
            'author' => [
                'id' => $this->author_id,
                'username' => $this->whenLoaded('author', fn () => $this->author->username),
            ],
            'novel' => $this->whenLoaded('novel', fn () => [
                'id' => $this->novel->id,
                'slug' => $this->novel->slug,
                'title' => $this->novel->title,
                'genre_id' => $this->novel->genre_id,
            ]),
            'published_at' => $this->published_at?->toIso8601String(),
        ];
    }
}
