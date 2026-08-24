<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class LikeGuard
{
    /**
     * @throws AuthorizationException
     */
    public function authorizeLike(User $user, Chapter $chapter): void
    {
        if ($user->isBanned()) {
            throw new AuthorizationException(__('likes.denied.banned'));
        }

        if ($this->failsEmailVerification($user)) {
            throw new AuthorizationException(__('likes.denied.unverified_email'));
        }

        if ($this->failsMinimumAge($user)) {
            throw new AuthorizationException(__('likes.denied.account_too_young'));
        }

        if ($user->id === $chapter->author_id) {
            throw new AuthorizationException(__('likes.denied.own_chapter'));
        }

        if (! $chapter->isPublished()) {
            throw new AuthorizationException(__('likes.denied.not_published'));
        }
    }

    private function failsEmailVerification(User $user): bool
    {
        if (! Config::boolean('ghosty.likes.requires_verified_email')) {
            return false;
        }

        return $user->email_verified_at === null;
    }

    private function failsMinimumAge(User $user): bool
    {
        $minimumAge = Config::integer('ghosty.likes.min_account_age_hours');

        if ($minimumAge <= 0) {
            return false;
        }

        return $user->created_at->addHours($minimumAge)->isFuture();
    }
}
