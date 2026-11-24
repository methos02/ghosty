<?php

namespace App\Repositories;

use App\Models\Chapter;
use App\Models\Follow;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
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
     * @param  array<string, mixed>  $attributes
     */
    public function update(User $user, array $attributes): User
    {
        $user->forceFill($attributes)->save();

        return $user;
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
     */
    public function deleteTokens(int $userId, ?int $keptTokenId = null): void
    {
        PersonalAccessToken::query()
            ->where('tokenable_type', (new User)->getMorphClass())
            ->where('tokenable_id', $userId)
            ->when($keptTokenId !== null, fn (Builder $tokens): Builder => $tokens->whereKeyNot($keptTokenId))
            ->delete();
    }

    /**
     * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
     */
    public function isUsernameTaken(string $username, ?int $ownerId = null): bool
    {
        return User::query()
            ->whereRaw('lower(username) = ?', [Str::lower($username)])
            ->when($ownerId !== null, fn (Builder $users): Builder => $users->whereKeyNot($ownerId))
            ->exists();
    }

    /**
     * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
     */
    public function findProfile(int $userId, ?int $viewerId = null): User
    {
        return User::query()
            ->addSelect([
                'novel_count' => $this->publishedNovelCount(),
                'chapter_count' => $this->profileChapterCount(),
                'chapter_read_count' => $this->profileChapterSum('read_count'),
                'chapter_like_count' => $this->profileChapterSum('like_count'),
                'received_continuation_count' => $this->continuationsByOthersCount(),
                'cover_count' => $this->publishedCoverCount(),
                'cover_like_count' => $this->publishedCoverLikeSum(),
                'official_cover_count' => $this->officialCoverCount(),
            ])
            ->withUserReport($viewerId)
            ->findOrFail($userId);
    }

    /**
     * @return Builder<Novel>
     */
    private function publishedNovelCount(): Builder
    {
        return Novel::query()
            ->selectRaw('count(*)')
            ->published()
            ->whereColumn('author_id', 'users.id');
    }

    /**
     * @return Builder<Chapter>
     */
    private function profileChapterCount(): Builder
    {
        return Chapter::query()
            ->selectRaw('count(*)')
            ->published()
            ->whereColumn('author_id', 'users.id');
    }

    /**
     * @param  'read_count'|'like_count'  $column
     * @return Builder<Chapter>
     */
    private function profileChapterSum(string $column): Builder
    {
        return Chapter::query()
            ->selectRaw('coalesce(sum('.$column.'), 0)')
            ->published()
            ->whereColumn('author_id', 'users.id');
    }

    /**
     * @return Builder<Chapter>
     */
    private function continuationsByOthersCount(): Builder
    {
        return Chapter::query()
            ->selectRaw('count(*)')
            ->published()
            ->whereColumn('author_id', '!=', 'users.id')
            ->whereIn(
                'parent_id',
                Chapter::query()
                    ->select('id')
                    ->whereColumn('author_id', 'users.id')
            );
    }

    /**
     * @return Builder<NovelCover>
     */
    private function publishedCoverCount(): Builder
    {
        return NovelCover::query()
            ->selectRaw('count(*)')
            ->published()
            ->whereColumn('author_id', 'users.id');
    }

    /**
     * @return Builder<NovelCover>
     */
    private function publishedCoverLikeSum(): Builder
    {
        return NovelCover::query()
            ->selectRaw('coalesce(sum(like_count), 0)')
            ->published()
            ->whereColumn('author_id', 'users.id');
    }

    /**
     * @return Builder<NovelCover>
     */
    private function officialCoverCount(): Builder
    {
        return $this->publishedCoverCount()
            ->whereIn(
                'id',
                Novel::query()
                    ->select('official_cover_id')
                    ->whereNotNull('official_cover_id')
            );
    }

    public function addRole(User $user, string $role): void
    {
        if ($user->hasRole($role)) {
            return;
        }

        $user->forceFill(['roles' => [...$user->roles, $role]])->save();
    }

    /**
     * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
     */
    public function findByEmailOrUsername(string $identifier): ?User
    {
        $userByEmail = User::query()
            ->where('email', $identifier)
            ->whereNull('deleted_at')
            ->first();

        return $userByEmail ?? User::query()
            ->whereRaw('lower(username) = ?', [Str::lower($identifier)])
            ->whereNull('deleted_at')
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
