<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @mixin Model
 *
 * @method static void creating(callable $callback)
 * @method static \Illuminate\Database\Eloquent\Builder where(string $column, mixed $value)
 */
trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::creating(function (Model $model): void {
            if (blank($model->slug)) {
                $model->slug = $model->generateUniqueSlug($model->{$model->slugSource()});
            }
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

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
