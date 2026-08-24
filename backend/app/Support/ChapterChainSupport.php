<?php

namespace App\Support;

use App\Models\Chapter;
use Illuminate\Support\Collection;

final class ChapterChainSupport
{
    /**
     * @param  Collection<int, Chapter>  $candidates
     * @return Collection<int, Chapter>
     */
    public static function fromRoot(Collection $candidates): Collection
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
