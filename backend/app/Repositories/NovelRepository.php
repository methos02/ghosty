<?php

namespace App\Repositories;

use App\Models\Chapter;
use App\Models\Novel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\Relation;

class NovelRepository
{
    /**
     * @return LengthAwarePaginator<int, Novel>
     */
    public function paginate(string $search = '', ?int $genreId = null, int $perPage = 15): LengthAwarePaginator
    {
        return Novel::with(['genre', 'author'])
            ->whereNotIn(
                'id',
                Chapter::query()
                    ->drafts()
                    ->roots()
                    ->select('novel_id')
            )
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
     * @return Collection<int, Novel>
     */
    public function containingChaptersPublishedByAuthor(int $authorId): Collection
    {
        return Novel::query()
            ->whereIn(
                'id',
                Chapter::query()
                    ->published()
                    ->byAuthor($authorId)
                    ->select('novel_id')
            )
            ->with(['chapters' => function (Relation $chapters) use ($authorId): void {
                $chapters->whereIn(
                    'id',
                    Chapter::query()
                        ->published()
                        ->byAuthor($authorId)
                        ->select('id')
                );
                $chapters->orderBy('published_at');
                $chapters->orderBy('id');
            }])
            ->orderBy('title')
            ->get();
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
     * @see memory-bank/decisions/ADR-13-commentaires.md
     */
    public function incrementCommentCount(Novel $novel): void
    {
        Novel::whereKey($novel->id)
            ->toBase()
            ->increment('comment_count');
    }

    /**
     * @see memory-bank/decisions/ADR-13-commentaires.md
     */
    public function decrementCommentCount(Novel $novel): void
    {
        Novel::whereKey($novel->id)
            ->where('comment_count', '>', 0)
            ->toBase()
            ->decrement('comment_count');
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

    public function deleteById(int $novelId): void
    {
        Novel::whereKey($novelId)
            ->delete();
    }
}
