<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-02-slug-natif-sans-package.md
 *
 * @mixin Model
 *
 * @property string $slug
 */
trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::creating(function (self $model): void {
            if (! blank($model->slug)) {
                return;
            }

            $source = $model->getAttribute($model->slugSource());

            if (! is_string($source)) {
                throw new LogicException(
                    sprintf('%s::slugSource() désigne « %s », qui ne porte pas de texte.', $model::class, $model->slugSource())
                );
            }

            $model->slug = $model->generateUniqueSlug($source);
        });
    }

    public function slugSource(): string
    {
        return 'title';
    }

    public function generateUniqueSlug(string $value): string
    {
        $base = Str::slug($value);
        $slug = $base;
        $suffix = 2;

        while (static::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
