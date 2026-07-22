<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @mixin IdeHelperGenre
 */
class Genre extends Model
{
    protected $fillable = [
        'name',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Genre $genre): void {
            if (empty($genre->slug)) {
                $genre->slug = Str::slug($genre->name);
            }
        });
    }
}
