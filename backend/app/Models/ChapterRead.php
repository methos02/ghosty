<?php

namespace App\Models;

use Database\Factories\ChapterReadFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 *
 * @mixin IdeHelperChapterRead
 */
class ChapterRead extends Model
{
    /** @use HasFactory<ChapterReadFactory> */
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'chapter_id',
        'user_id',
        'session_key',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Chapter, $this>
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
