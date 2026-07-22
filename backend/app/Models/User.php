<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * @mixin IdeHelperUser
 */
class User extends Authenticatable
{
    /**
     * @use HasApiTokens<PersonalAccessToken>
     * @use HasFactory<UserFactory>
     */
    use HasApiTokens, HasFactory, Notifiable;

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

    protected $attributes = [
        'roles' => '["reader"]',
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

    /**
     * @see memory-bank/decisions/ADR-01-modele-de-ban-utilisateur.md
     *
     * @phpstan-assert-if-true !null $this->banned_until
     */
    public function isBanned(): bool
    {
        $bannedUntil = $this->banned_until;

        if (! $bannedUntil) {
            return false;
        }

        return $bannedUntil->isFuture();
    }
}
