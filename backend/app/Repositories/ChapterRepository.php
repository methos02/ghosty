<?php

namespace App\Repositories;

use App\DTO\DraftFilterDTO;
use App\Models\Chapter;
use App\Support\ChapterChainSupport;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ChapterRepository
{
    /**
     * @return Collection<int, Chapter>
     */
    public function currentBranch(string $novelSlug): Collection
    {
        $branchEnd = Chapter::query()
            ->published()
            ->whereRelation('novel', 'slug', $novelSlug)
            ->orderByDesc('branch_like_count')
            ->orderByDesc('depth')
            ->orderBy('published_at')
            ->first();

        if ($branchEnd === null) {
            return new Collection;
        }

        $branch = Chapter::query()
            ->with(['author', 'viewerLikes'])
            ->published()
            ->whereIn('id', $branchEnd->pathChapterIds())
            ->orderBy('depth')
            ->get();

        return ChapterChainSupport::fromRoot($branch);
    }

    /**
     * @return Collection<int, Chapter>
     */
    public function mostPopularBranchEnds(string $novelSlug, int $limit): Collection
    {
        return Chapter::query()
            ->with('author')
            ->published()
            ->whereRelation('novel', 'slug', $novelSlug)
            ->where('continuations_count', 0)
            ->orderByDesc('branch_like_count')
            ->orderBy('published_at')
            ->limit($limit)
            ->get();
    }

    public function find(int $id, bool $withoutRelations = false): Chapter
    {
        if ($withoutRelations) {
            return Chapter::findOrFail($id);
        }

        return Chapter::with(['author', 'novel', 'viewerLikes'])->findOrFail($id);
    }

    public function findInNovel(int $chapterId, string $novelSlug): Chapter
    {
        return Chapter::with(['author', 'viewerLikes'])
            ->whereKey($chapterId)
            ->whereRelation('novel', 'slug', $novelSlug)
            ->firstOrFail();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Chapter
    {
        return Chapter::create($attributes);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Chapter $chapter, array $attributes): Chapter
    {
        $chapter->update($attributes);

        return $chapter;
    }

    public function delete(Chapter $chapter): void
    {
        $chapter->delete();
    }

    public function deleteByNovel(int $novelId): void
    {
        Chapter::where('novel_id', $novelId)->delete();
    }

    public function parentOf(Chapter $chapter): ?Chapter
    {
        if ($chapter->parent_id === null) {
            return null;
        }

        return Chapter::find($chapter->parent_id);
    }

    /**
     * @return Collection<int, Chapter>
     */
    public function draftsByOwner(int $ownerId, DraftFilterDTO $filters = new DraftFilterDTO): Collection
    {
        return Chapter::query()
            ->with('novel')
            ->drafts()
            ->where('author_id', $ownerId)
            ->when(
                $filters->parentId !== null,
                fn (Builder $query) => $query->where('parent_id', $filters->parentId)
            )
            ->when($filters->isRoot === true, fn (Builder $query) => $query->whereNull('parent_id'))
            ->when($filters->isRoot === false, fn (Builder $query) => $query->whereNotNull('parent_id'))
            ->latest('updated_at')
            ->get();
    }

    public function incrementChildrenCount(Chapter $parent): void
    {
        $parent->increment('continuations_count');
    }

    public function updateBranchLikeCount(Chapter $chapter, Chapter $parent): void
    {
        $chapter->forceFill([
            'branch_like_count' => $parent->branch_like_count,
        ])->save();
    }

    /**
     * @return Collection<int, Chapter>
     */
    public function children(int $parentId): Collection
    {
        return Chapter::query()
            ->with(['author', 'viewerLikes'])
            ->published()
            ->where('parent_id', $parentId)
            ->orderByDesc('like_count')
            ->orderBy('published_at')
            ->get();
    }

    /**
     * @return Collection<int, Chapter>
     */
    public function ancestorsOf(Chapter $chapter): Collection
    {
        $ancestorIds = $chapter->ancestorIds();

        if ($ancestorIds === []) {
            return new Collection;
        }

        return Chapter::query()
            ->with(['author', 'viewerLikes'])
            ->published()
            ->whereIn('id', $ancestorIds)
            ->orderBy('depth')
            ->get();
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     *
     * @return Collection<int, Chapter>
     */
    public function mostPopularBranchWithChapter(Chapter $chapter): Collection
    {
        $branchEnd = $this->mostPopularDescendantOf($chapter) ?? $chapter;

        $branch = Chapter::query()
            ->with(['author', 'viewerLikes'])
            ->published()
            ->whereIn('id', $branchEnd->pathChapterIds())
            ->orderBy('depth')
            ->get();

        $chain = ChapterChainSupport::fromRoot($branch);

        if ($chain->contains('id', $chapter->id)) {
            return $chain;
        }

        return new Collection([$chapter]);
    }

    private function mostPopularDescendantOf(Chapter $chapter): ?Chapter
    {
        return Chapter::query()
            ->published()
            ->where('novel_id', $chapter->novel_id)
            ->whereLike('path', $chapter->path.'%')
            ->whereKeyNot($chapter->id)
            ->orderByDesc('branch_like_count')
            ->orderByDesc('depth')
            ->orderBy('published_at')
            ->first();
    }

    /**
     * @return Collection<int, Chapter>
     */
    public function branchEndingWith(Chapter $chapter): Collection
    {
        return Chapter::query()
            ->with(['author', 'viewerLikes'])
            ->published()
            ->whereIn('id', $chapter->pathChapterIds())
            ->orderBy('depth')
            ->get();
    }

    /**
     * @param  Collection<int, Chapter>  $chapters
     * @return Collection<int, Chapter>
     */
    public function withChildren(string $novelSlug, Collection $chapters): Collection
    {
        $parentIds = $chapters->pluck('id')->all();

        if ($parentIds === []) {
            return new Collection;
        }

        $children = $this->treeQuery($novelSlug)
            ->whereIn('parent_id', $parentIds)
            ->get();

        return $chapters->concat($children)
            ->unique('id')
            ->sortBy([['depth', 'asc'], ['branch_like_count', 'desc']])
            ->values();
    }

    /**
     * @return Builder<Chapter>
     */
    private function treeQuery(string $novelSlug): Builder
    {
        return Chapter::query()
            ->with(['author', 'viewerLikes'])
            ->published()
            ->whereRelation('novel', 'slug', $novelSlug)
            ->orderBy('depth')
            ->orderByDesc('branch_like_count')
            ->orderBy('published_at');
    }
}
