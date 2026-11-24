<?php

namespace App\Models;

use App\Enums\NotificationType;
use App\Enums\SanctionType;
use App\Models\Concerns\HasRandomSlug;
use App\Models\Concerns\HasReports;
use App\Models\Concerns\IsNotificationSubject;
use App\Models\Contracts\Reportable;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 *
 * @mixin IdeHelperUser
 */
class User extends Authenticatable implements Reportable
{
    /**
     * @use HasApiTokens<PersonalAccessToken>
     * @use HasFactory<UserFactory>
     */
    use HasApiTokens, HasFactory, HasRandomSlug, HasReports, IsNotificationSubject, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'roles',
        'avatar',
        'notifications_enabled',
        'disabled_notification_types',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $attributes = [
        'roles' => '["reader"]',
    ];

    const AVATAR_DISK = 'public';

    const DELETED_PREFIX = 'deleted-';

    public function profileSlug(): string
    {
        $name = Str::slug($this->username);

        if ($name === '') {
            return $this->slug;
        }

        return $this->slug.'-'.$name;
    }

    public function isDeleted(): bool
    {
        return $this->deleted_at !== null;
    }

    /**
     * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
     */
    public function wantsNotification(NotificationType $type): bool
    {
        if (! $type->isOptional()) {
            return true;
        }

        if (! $this->notifications_enabled) {
            return false;
        }

        return ! in_array($type->value, $this->disabled_notification_types ?? [], true);
    }

    public function displayName(): string
    {
        if ($this->isDeleted()) {
            return __('users.deleted');
        }

        return $this->username;
    }

    public function avatarUrl(): ?string
    {
        if ($this->avatar === null) {
            return null;
        }

        return Storage::disk(self::AVATAR_DISK)->url($this->avatar);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'deleted_at' => 'datetime',
            'notifications_enabled' => 'boolean',
            'disabled_notification_types' => 'array',
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

    public function reportedUser(): User
    {
        return $this;
    }

    public function canModerate(): bool
    {
        return ($this->isModerator() || $this->isAdmin()) && ! $this->isBanned();
    }

    /**
     * @see memory-bank/decisions/ADR-18-indicateurs-du-mvp.md
     */
    public function canViewMetrics(): bool
    {
        return $this->isAdmin() && ! $this->isBanned();
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
