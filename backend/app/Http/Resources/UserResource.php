<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 *
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'slug' => $this->slug,
            'profile_slug' => $this->profileSlug(),
            'is_deleted' => $this->isDeleted(),
            'email' => $this->email,
            'roles' => $this->roles,
            'avatar' => $this->avatar,
            'avatar_url' => $this->avatarUrl(),
            'notifications_enabled' => $this->notifications_enabled,
            'disabled_notification_types' => $this->disabled_notification_types ?? [],
            'new_messages_count' => $this->new_messages_count,
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
