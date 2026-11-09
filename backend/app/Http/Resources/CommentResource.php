<?php

namespace App\Http\Resources;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 *
 * @mixin Comment
 */
class CommentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'author' => $this->visibleAuthor(),
            'content' => $this->isVisible() ? $this->content : null,
            'is_spoiler' => $this->is_spoiler,
            'is_deleted' => $this->isDeleted(),
            'is_hidden' => $this->isHidden(),
            'is_reported' => (bool) $this->getAttribute('is_reported'),
            'reply_count' => $this->reply_count,
            'replies' => CommentResource::collection($this->whenLoaded('visibleReplies')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function visibleAuthor(): ?array
    {
        if (! $this->isVisible()) {
            return null;
        }

        return [
            'id' => $this->author_id,
            'username' => $this->whenLoaded('author', fn () => $this->author->username),
        ];
    }
}
