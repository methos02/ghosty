<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Novel extends Model
{
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

    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class);
    }
}
