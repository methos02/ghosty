<?php

namespace App\Http\Resources;

use App\Helpers\AggregateHelper;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 *
 * @mixin User
 */
class UserProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'avatar' => $this->avatar,
            'roles' => $this->roles,
            'created_at' => $this->created_at->toIso8601String(),
            ...$this->detailAttributes(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function detailAttributes(): array
    {
        return [
            'is_reported' => (bool) $this->getAttribute('is_reported'),
            'statistics' => [
                'read_count' => AggregateHelper::toInteger($this->getAttribute('chapter_read_count')),
                'like_count' => AggregateHelper::toInteger($this->getAttribute('chapter_like_count')) + AggregateHelper::toInteger($this->getAttribute('cover_like_count')),
                'received_continuation_count' => AggregateHelper::toInteger($this->getAttribute('received_continuation_count')),
                'novel_count' => AggregateHelper::toInteger($this->getAttribute('novel_count')),
                'chapter_count' => AggregateHelper::toInteger($this->getAttribute('chapter_count')),
                'cover_count' => AggregateHelper::toInteger($this->getAttribute('cover_count')),
                'official_cover_count' => AggregateHelper::toInteger($this->getAttribute('official_cover_count')),
            ],
        ];
    }
}
