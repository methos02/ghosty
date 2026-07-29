<?php

namespace App\Models;

use Database\Factories\WorkFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperWork
 */
class Work extends Model
{
    /** @use HasFactory<WorkFactory> */
    use HasFactory;

    const TYPE_CHAPTER = 1;

    const TYPE_COVER = 2;

    protected $fillable = [
        'novel_id',
        'author_id',
        'title',
        'content',
        'order',
        'type',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'type' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Novel, $this>
     */
    public function novel(): BelongsTo
    {
        return $this->belongsTo(Novel::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
