<?php

namespace App\Models;

use Database\Factories\NovelFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperNovel
 */
class Novel extends Model
{
    /** @use HasFactory<NovelFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'genre_id',
        'cover_url',
        'is_favorite',
    ];

    protected function casts(): array
    {
        return [
            'is_favorite' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Genre, $this>
     */
    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class);
    }
}
