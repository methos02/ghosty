<?php

namespace App\Repositories;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Support\Collection;
use Laravel\Sanctum\PersonalAccessToken;

class UserRepository
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): User
    {
        return User::create($attributes);
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    public function deleteTokens(int $userId): void
    {
        PersonalAccessToken::query()
            ->where('tokenable_type', (new User)->getMorphClass())
            ->where('tokenable_id', $userId)
            ->delete();
    }

    public function findByEmailOrUsername(string $identifier): ?User
    {
        $userByEmail = User::query()
            ->where('email', $identifier)
            ->first();

        return $userByEmail ?? User::query()
            ->where('username', $identifier)
            ->first();
    }

    /**
     * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
     *
     * @param  list<int>  $chapterIds
     * @return Collection<int, User>
     */
    public function followersOfChapters(array $chapterIds): Collection
    {
        if ($chapterIds === []) {
            return new Collection;
        }

        return User::query()
            ->whereIn(
                'id',
                Follow::query()
                    ->select('user_id')
                    ->whereIn('chapter_id', $chapterIds)
            )
            ->get();
    }
}
