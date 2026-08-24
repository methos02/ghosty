<?php

namespace App\Models\Concerns;

use App\Models\Like;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;

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
     * @return MorphMany<Like, $this>
     */
    public function viewerLikes(): MorphMany
    {
        return $this->likes()->where('user_id', Auth::id() ?? 0);
    }

    public function isLikedByViewer(): bool
    {
        return $this->relationLoaded('viewerLikes') && $this->viewerLikes->isNotEmpty();
    }
}
