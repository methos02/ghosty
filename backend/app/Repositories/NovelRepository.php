<?php

namespace App\Repositories;

use App\Models\Chapter;
use App\Models\Novel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class NovelRepository
{
    private const DETAIL_RELATIONS = ['genre', 'author', 'officialCover'];

    /**
     * @return LengthAwarePaginator<int, Novel>
     */
    public function paginate(string $search = '', ?int $genreId = null, int $perPage = 15): LengthAwarePaginator
    {
        return Novel::with(self::DETAIL_RELATIONS)
            ->published()
            ->when($search !== '', fn (Builder $query) => $query->whereLike('title', "%{$search}%"))
            ->when($genreId !== null, fn (Builder $query) => $query->where('genre_id', $genreId))
            ->paginate($perPage);
    }

    /**
     * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
     *
     * @return LengthAwarePaginator<int, Novel>
     */
    public function paginateByAuthor(int $authorId, int $perPage): LengthAwarePaginator
    {
        return Novel::with(self::DETAIL_RELATIONS)
            ->published()
            ->where('author_id', $authorId)
            ->latest()
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function loadDetails(Novel $novel): Novel
    {
        return $novel->load(self::DETAIL_RELATIONS);
    }

    public function findBySlug(string $slug): Novel
    {
        return Novel::with(self::DETAIL_RELATIONS)
            ->where('slug', $slug)
            ->firstOrFail();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Novel
    {
        return Novel::create($attributes);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Novel $novel, array $attributes): Novel
    {
        $novel->update($attributes);

        return $novel;
    }

    /**
     * @see memory-bank/decisions/ADR-03-compteur-denormalise-chapter-count.md
     */
    public function incrementChapterCount(int $novelId): void
    {
        Novel::whereKey($novelId)
            ->increment('chapter_count');
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    public function decrementChapterCount(int $novelId): void
    {
        Novel::whereKey($novelId)
            ->where('chapter_count', '>', 0)
            ->decrement('chapter_count');
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function setLastChapterOfMainBranch(int $novelId, int $chapterId): void
    {
        Novel::whereKey($novelId)
            ->toBase()
            ->update(['main_branch_last_chapter_id' => $chapterId]);
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function trimMainBranchTo(int $novelId, int $chapterId): void
    {
        Novel::whereKey($novelId)
            ->toBase()
            ->update([
                'main_branch_last_chapter_id' => $chapterId,
                'branch_recomputed_at' => null,
            ]);
    }

    /**
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     */
    public function findOfficialCoverId(int $novelId): ?int
    {
        $officialCoverId = Novel::query()
            ->whereKey($novelId)
            ->value('official_cover_id');

        return is_int($officialCoverId) ? $officialCoverId : null;
    }

    /**
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     */
    public function setOfficialCover(int $novelId, ?int $coverId): void
    {
        Novel::whereKey($novelId)
            ->toBase()
            ->update(['official_cover_id' => $coverId]);
    }

    public function deleteById(int $novelId): void
    {
        Novel::whereKey($novelId)
            ->delete();
    }
}
