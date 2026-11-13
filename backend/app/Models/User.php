<?php

namespace App\Models;

use App\Enums\SanctionType;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'username',
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
            'notifications_enabled' => 'boolean',
            'password' => 'hashed',
            'roles' => 'array',
        ];
    }

    const ROLE_READER = 'reader';

    const ROLE_AUTHOR = 'author';

    const ROLE_MODERATOR = 'moderator';

    const ROLE_ADMIN = 'admin';

    const ROLE_ILLUSTRATOR = 'illustrator';

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
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     *
     * @return HasMany<Sanction, $this>
     */
    public function sanctions(): HasMany
    {
        return $this->hasMany(Sanction::class);
    }

    /**
     * @return HasMany<Sanction, $this>
     */
    public function activeBans(): HasMany
    {
        return $this->sanctions()
            ->activeBans()
            ->orderByRaw('until is null desc')
            ->orderByDesc('until');
    }

    public function canModerate(): bool
    {
        return ($this->isModerator() || $this->isAdmin()) && ! $this->isBanned();
    }

    public function isBanned(): bool
    {
        return $this->accountBan() !== null;
    }

    public function isWriteBanned(): bool
    {
        return $this->isBanned() || $this->hasActiveBan(SanctionType::WriteBan);
    }

    public function isCommentBanned(): bool
    {
        return $this->isBanned() || $this->hasActiveBan(SanctionType::CommentBan);
    }

    public function accountBan(): ?Sanction
    {
        return $this->activeBans->first(fn (Sanction $sanction): bool => $sanction->type === SanctionType::AccountBan);
    }

    private function hasActiveBan(SanctionType $type): bool
    {
        return $this->activeBans->contains(fn (Sanction $sanction): bool => $sanction->type === $type);
    }
}
