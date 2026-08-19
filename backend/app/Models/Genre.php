<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use Database\Factories\GenreFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperGenre
 */
class Genre extends Model
{
    /** @use HasFactory<GenreFactory> */
    use HasFactory;

    use HasSlug;

    protected $fillable = [
        'name',
    ];

    public function slugSource(): string
    {
        return 'name';
    }
}
