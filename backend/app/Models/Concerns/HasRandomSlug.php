<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 *
 * @mixin Model
 *
 * @property string $slug
 */
trait HasRandomSlug
{
    const SLUG_LENGTH = 6;

    public static function bootHasRandomSlug(): void
    {
        static::creating(function (self $model): void {
            if (! blank($model->slug)) {
                return;
            }

            $model->slug = static::generateUniqueSlug();
        });
    }

    public static function generateUniqueSlug(): string
    {
        do {
            $slug = Str::lower(Str::random(self::SLUG_LENGTH));
        } while (self::isSlugTaken($slug));

        return $slug;
    }

    private static function isSlugTaken(string $slug): bool
    {
        return static::query()
            ->where('slug', $slug)
            ->exists();
    }
}
