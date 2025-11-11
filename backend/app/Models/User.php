<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'pseudo',
        'email',
        'password',
        'roles',
        'avatar',
        'notifications_enabled',
        'firstname',
        'lastname',
        'birth_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birth_date' => 'date',
            'banned_until' => 'date',
            'notifications_enabled' => 'boolean',
            'password' => 'hashed',
            'roles' => 'array',
        ];
    }

    // Role constants
    const ROLE_READER = 'reader';
    const ROLE_AUTHOR = 'author';
    const ROLE_MODERATOR = 'moderator';
    const ROLE_ADMIN = 'admin';

    // Helper methods
    public function hasRole(string $role): bool
    {
        return in_array($role, $this->roles ?? []);
    }

    public function isAuthor(): bool
    {
        return $this->hasRole(self::ROLE_AUTHOR);
    }

    public function isModerator(): bool
    {
        return $this->hasRole(self::ROLE_MODERATOR);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN);
    }

    public function isBanned(): bool
    {
        if (!$this->banned_until) {
            return false;
        }

        return $this->banned_until->isFuture();
    }
}
