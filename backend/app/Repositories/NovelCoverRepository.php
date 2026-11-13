<?php

namespace App\Repositories;

use App\Models\Like;
use App\Models\Novel;
use App\Models\NovelCover;
use Illuminate\Database\Eloquent\Collection;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class NovelCoverRepository
{
    /**
     * @return Collection<int, NovelCover>
     */
    public function listPublishedByNovel(Novel $novel, ?int $userId): Collection
    {
        return NovelCover::query()
            ->with('author')
            ->withUserLike($userId)
            ->withUserReport($userId)
            ->published()
            ->where('novel_id', $novel->id)
            ->orderByRaw('id = ? desc', [$novel->official_cover_id ?? 0])
            ->orderByDesc('like_count')
            ->oldest()
            ->orderBy('id')
            ->get()
            ->each(fn (NovelCover $cover) => $cover->setRelation('novel', $novel));
    }

    public function find(int $coverId, ?int $userId = null): NovelCover
    {
        return NovelCover::query()
            ->with(['author', 'novel'])
            ->withUserLike($userId)
            ->withUserReport($userId)
            ->findOrFail($coverId);
    }

    public function findIdByAuthor(int $novelId, int $authorId): ?int
    {
        $coverId = NovelCover::query()
            ->where('novel_id', $novelId)
            ->where('author_id', $authorId)
            ->value('id');

        return is_int($coverId) ? $coverId : null;
    }

    public function findPublished(int $coverId): ?NovelCover
    {
        return NovelCover::query()
            ->published()
            ->find($coverId);
    }

    public function findMostLikedPublished(int $novelId): ?NovelCover
    {
        return NovelCover::query()
            ->published()
            ->where('novel_id', $novelId)
            ->orderByDesc('like_count')
            ->oldest()
            ->orderBy('id')
            ->first();
    }

    public function findLikedByUser(int $novelId, int $userId): ?NovelCover
    {
        return NovelCover::query()
            ->where('novel_id', $novelId)
            ->whereIn(
                'id',
                Like::query()
                    ->select('likeable_id')
                    ->where('likeable_type', (new NovelCover)->getMorphClass())
                    ->where('user_id', $userId)
            )
            ->first();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): NovelCover
    {
        return NovelCover::query()
            ->create($attributes)
            ->load('author');
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(NovelCover $cover, array $attributes): NovelCover
    {
        $cover->update($attributes);

        return $cover;
    }

    public function resetLikeCount(NovelCover $cover): void
    {
        NovelCover::query()
            ->whereKey($cover->id)
            ->toBase()
            ->update(['like_count' => 0]);
    }
}
