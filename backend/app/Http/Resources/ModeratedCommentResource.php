<?php

namespace App\Http\Resources;

use App\Helpers\NotificationDataHelper;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 *
 * @mixin Comment
 */
class ModeratedCommentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'author' => [
                'id' => $this->author_id,
                'username' => $this->whenLoaded('author', fn () => $this->author->username),
            ],
            'content' => $this->content,
            'is_spoiler' => $this->is_spoiler,
            'is_deleted' => $this->isDeleted(),
            'is_hidden' => $this->isHidden(),
            ...NotificationDataHelper::contentSubject($this->target()),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
