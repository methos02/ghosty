<?php

namespace App\Repositories;

use App\DTO\DraftFilterDTO;
use App\Models\Chapter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ChapterRepository
{
    /**
     * @return Collection<int, Chapter>
     */
    public function currentContinuity(string $novelSlug): Collection
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
            ->with('author')
            ->published()
            ->whereIn('id', $branchEnd->pathChapterIds())
            ->orderBy('depth')
            ->get();

        return $this->chainFromRoot($branch);
    }

    /**
     * @return Collection<int, Chapter>
     */
    public function bestBranches(string $novelSlug, int $limit): Collection
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

    public function find(int $id): Chapter
    {
        return Chapter::with(['author', 'novel'])->findOrFail($id);
    }

    public function findInNovel(int $chapterId, string $novelSlug): Chapter
    {
        return Chapter::whereKey($chapterId)
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

    public function incrementContinuations(Chapter $parent): void
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
     * @param  list<int>  $chapterIds
     */
    /**
     * @return Collection<int, Chapter>
     */
    public function children(int $parentId): Collection
    {
        return Chapter::query()
            ->with('author')
            ->published()
            ->where('parent_id', $parentId)
            ->orderByDesc('like_count')
            ->orderBy('published_at')
            ->get();
    }

    /**
     * @param  Collection<int, Chapter>  $candidates
     * @return Collection<int, Chapter>
     */
    private function chainFromRoot(Collection $candidates): Collection
    {
        $root = $candidates->firstWhere('parent_id', null);

        if ($root === null) {
            return new Collection;
        }

        $byParent = $candidates->groupBy('parent_id');
        $chain = new Collection([$root]);
        $current = $root;

        while ($next = $byParent->get($current->id)?->first()) {
            $chain->push($next);
            $current = $next;
        }

        return $chain;
    }
}
