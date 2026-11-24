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
class UserIdentityResource extends JsonResource
{
    /**
     * @return array{id: int, username: string, slug: string, profile_slug: string, is_deleted: bool}
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->displayName(),
            'slug' => $this->slug,
            'profile_slug' => $this->profileSlug(),
            'is_deleted' => $this->isDeleted(),
        ];
    }
}
