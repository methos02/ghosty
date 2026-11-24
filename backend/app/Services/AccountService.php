<?php

namespace App\Services;

use App\DTO\NotificationPreferencesDTO;
use App\DTO\UserProfileDTO;
use App\Models\User;
use App\Repositories\ChapterReadRepository;
use App\Repositories\FollowRepository;
use App\Repositories\NotificationRepository;
use App\Repositories\ReadingProgressRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
class AccountService
{
    private const AVATAR_DIRECTORY = 'avatars';

    private const DELETED_EMAIL_DOMAIN = '@ghosty.invalid';

    public function __construct(
        private readonly UserRepository $usersR,
        private readonly FollowRepository $followsR,
        private readonly ReadingProgressRepository $readingProgressR,
        private readonly NotificationRepository $notificationsR,
        private readonly ChapterReadRepository $chapterReadsR
    ) {}

    public function updateProfile(User $user, UserProfileDTO $userProfileDTO): User
    {
        if ($userProfileDTO->avatar === null) {
            return $this->usersR->update($user, $userProfileDTO->attributes());
        }

        $previousAvatar = $user->avatar;
        $avatarPath = $userProfileDTO->avatar->store(self::AVATAR_DIRECTORY.'/'.$user->id, User::AVATAR_DISK);

        if ($avatarPath === false) {
            throw new LogicException('The avatar could not be stored.');
        }

        $this->usersR->update($user, [...$userProfileDTO->attributes(), 'avatar' => $avatarPath]);
        $this->deleteAvatarFile($previousAvatar);

        return $user;
    }

    public function updateNotificationPreferences(User $user, NotificationPreferencesDTO $notificationPreferencesDTO): User
    {
        return $this->usersR->update($user, $notificationPreferencesDTO->attributes());
    }

    public function updateEmail(User $user, string $email): User
    {
        return $this->usersR->update($user, ['email' => $email]);
    }

    public function updatePassword(User $user, string $password, int $keptTokenId): void
    {
        DB::transaction(function () use ($user, $password, $keptTokenId): void {
            $this->usersR->update($user, ['password' => Hash::make($password)]);
            $this->usersR->deleteTokens($user->id, $keptTokenId);
        });
    }

    public function deleteAvatar(User $user): User
    {
        $previousAvatar = $user->avatar;

        $this->usersR->update($user, ['avatar' => null]);
        $this->deleteAvatarFile($previousAvatar);

        return $user;
    }

    public function delete(User $user): void
    {
        $previousAvatar = $user->avatar;

        DB::transaction(function () use ($user): void {
            $this->followsR->deleteAllOfUser($user->id);
            $this->readingProgressR->deleteAllOfUser($user->id);
            $this->notificationsR->deleteAllOfRecipient($user);
            $this->chapterReadsR->detachUser($user->id);
            $this->usersR->deleteTokens($user->id);
            $this->usersR->update($user, [
                'username' => User::DELETED_PREFIX.$user->slug,
                'email' => User::DELETED_PREFIX.$user->slug.self::DELETED_EMAIL_DOMAIN,
                'password' => Hash::make(Str::random(64)),
                'avatar' => null,
                'remember_token' => null,
                'deleted_at' => now(),
            ]);
        });

        $this->deleteAvatarFile($previousAvatar);
    }

    private function deleteAvatarFile(?string $avatarPath): void
    {
        if ($avatarPath === null) {
            return;
        }

        Storage::disk(User::AVATAR_DISK)->delete($avatarPath);
    }
}
