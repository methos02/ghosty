<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pseudo' => $this->pseudo,
            'email' => $this->email,
            'roles' => $this->roles,
            'avatar' => $this->avatar,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'notifications_enabled' => $this->notifications_enabled,
            'warning_count' => $this->warning_count,
            'new_messages_count' => $this->new_messages_count,
            'banned_until' => $this->banned_until?->format('Y-m-d'),
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
