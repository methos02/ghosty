<?php

namespace App\Repositories;

use App\Models\Chapter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ChapterRepository
{
    /**
     * Continuité principale d'un roman : la racine, puis de proche en proche la
     * suite mise en avant. C'est le fil de lecture par défaut (MVP §8).
     *
     * Une seule requête : hors racine, tout chapitre de la continuité porte
     * `is_main_child`, et la chaîne est reconstituée en mémoire par `parent_id`
     * — deux branches peuvent en effet héberger une suite mise en avant à la
     * même profondeur.
     *
     * @return Collection<int, Chapter>
     */
    public function mainContinuity(string $novelSlug): Collection
    {
        $candidates = Chapter::query()
            ->with('author')
            ->published()
            ->whereRelation('novel', 'slug', $novelSlug)
            ->where(fn (Builder $query) => $query->whereNull('parent_id')->orWhere('is_main_child', true))
            ->orderBy('depth')
            ->get();

        return $this->chainFromRoot($candidates);
    }

    public function findWithRelations(int $id): Chapter
    {
        return Chapter::with(['author', 'novel'])->findOrFail($id);
    }

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
