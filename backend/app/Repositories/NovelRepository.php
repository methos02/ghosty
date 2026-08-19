<?php

namespace App\Repositories;

use App\Models\Chapter;
use App\Models\Novel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class NovelRepository
{
    /**
     * @return LengthAwarePaginator<int, Novel>
     */
    public function paginate(string $search = '', ?int $genreId = null, int $perPage = 15): LengthAwarePaginator
    {
        return Novel::with(['genre', 'author'])
            ->whereNotIn('id', $this->draftNovelIds())
            ->when($search !== '', fn (Builder $query) => $query->whereLike('title', "%{$search}%"))
            ->when($genreId !== null, fn (Builder $query) => $query->where('genre_id', $genreId))
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): Novel
    {
        return Novel::with(['genre', 'author'])
            ->where('slug', $slug)
            ->firstOrFail();
    }

    /**
     * @return Builder<Chapter>
     */
    private function draftNovelIds(): Builder
    {
        return Chapter::query()->drafts()->roots()->select('novel_id');
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
        Novel::whereKey($novelId)->increment('chapter_count');
    }

    public function deleteById(int $novelId): void
    {
        Novel::whereKey($novelId)->delete();
    }
}
