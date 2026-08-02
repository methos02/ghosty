<?php

namespace App\Models;

use Database\Factories\ChapterFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperChapter
 */
class Chapter extends Model
{
    /** @use HasFactory<ChapterFactory> */
    use HasFactory;

    const STATUS_PUBLISHED = 1;

    const STATUS_ARCHIVED = 2;

    const STATUS_HIDDEN = 3;

    const PATH_SEPARATOR = '/';

    protected $fillable = [
        'novel_id',
        'parent_id',
        'author_id',
        'title',
        'content',
        'summary',
        'path',
        'depth',
        'status',
        'published_at',
        'last_activity_at',
    ];

    protected function casts(): array
    {
        return [
            'depth' => 'integer',
            'continuations_count' => 'integer',
            'like_count' => 'integer',
            'comment_count' => 'integer',
            'read_count' => 'integer',
            'is_main_child' => 'boolean',
            'status' => 'integer',
            'published_at' => 'datetime',
            'last_activity_at' => 'datetime',
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

    /**
     * @return BelongsTo<Chapter, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Chapter::class, 'parent_id');
    }

    /**
     * Suites proposées à ce chapitre : elles coexistent, aucune n'élimine les autres.
     *
     * @return HasMany<Chapter, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(Chapter::class, 'parent_id');
    }

    /**
     * @param  Builder<Chapter>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', self::STATUS_PUBLISHED);
    }

    /**
     * @param  Builder<Chapter>  $query
     */
    public function scopeRoots(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    /**
     * Une proposition devient une branche dès qu'une suite publiée la poursuit.
     *
     * @param  Builder<Chapter>  $query
     */
    public function scopeBranches(Builder $query): void
    {
        $query->where('continuations_count', '>', 0);
    }

    public function isRoot(): bool
    {
        return $this->parent_id === null;
    }

    public function isBranch(): bool
    {
        return $this->continuations_count > 0;
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    /**
     * Identifiants des ancêtres, lus dans le chemin matérialisé. Le chapitre
     * lui-même, dernier segment du chemin, est exclu.
     *
     * @return list<int>
     */
    public function ancestorIds(): array
    {
        $ids = array_filter(explode(self::PATH_SEPARATOR, (string) $this->path));

        array_pop($ids);

        return array_values(array_map('intval', $ids));
    }
}
