<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 *
 * @mixin IdeHelperChapterVersion
 */
class ChapterVersion extends Model
{
    protected $fillable = [
        'chapter_id',
        'moderator_id',
        'content',
    ];
}
