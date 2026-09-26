<?php

namespace App\Models\Concerns;

use App\Models\Like;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 *
 * @mixin Model
 */
trait HasLikes
{
    /**
     * @return MorphMany<Like, $this>
     */
    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    /**
     * @param  Builder<static>  $query
     */
    public function scopeWithUserLike(Builder $query, ?int $userId): void
    {
        $query->addSelect([
            'is_liked' => Like::query()
                ->selectRaw('1')
                ->whereColumn('likeable_id', $query->getModel()->getQualifiedKeyName())
                ->where('likeable_type', $query->getModel()->getMorphClass())
                ->where('user_id', $userId ?? 0)
                ->limit(1),
        ]);
    }
}
