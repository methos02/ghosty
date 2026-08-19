<?php

namespace App\Models;

use Database\Factories\ChapterFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Config;

/**
 * @property-read User $author
 * @property-read Novel $novel
 *
 * @mixin IdeHelperChapter
 */
class Chapter extends Model
{
    /** @use HasFactory<ChapterFactory> */
    use HasFactory;

    const STATUS_DRAFT = 0;

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
        'corrected_at',
    ];

    protected function casts(): array
    {
        return [
            'depth' => 'integer',
            'continuations_count' => 'integer',
            'like_count' => 'integer',
            'branch_like_count' => 'integer',
            'comment_count' => 'integer',
            'read_count' => 'integer',
            'status' => 'integer',
            'published_at' => 'datetime',
            'corrected_at' => 'datetime',
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
    public function scopeDrafts(Builder $query): void
    {
        $query->where('status', self::STATUS_DRAFT);
    }

    /**
     * @param  Builder<Chapter>  $query
     */
    public function scopeRoots(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    /**
     * @param  Builder<Chapter>  $query
     */
    public function scopeContinued(Builder $query): void
    {
        $query->where('continuations_count', '>', 0);
    }

    public function isRoot(): bool
    {
        return $this->parent_id === null;
    }

    public function isContinued(): bool
    {
        return $this->continuations_count > 0;
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isCorrectable(): bool
    {
        if ($this->corrected_at !== null || $this->published_at === null) {
            return false;
        }

        $window = Config::integer('ghosty.chapters.proofreading.window_hours');

        return $this->published_at->addHours($window)->isFuture();
    }

    /**
     * @return list<int>
     */
    public function pathChapterIds(): array
    {
        $ids = array_filter(explode(self::PATH_SEPARATOR, (string) $this->path));

        return array_values(array_map('intval', $ids));
    }

    /**
     * @return list<int>
     */
    public function ancestorIds(): array
    {
        return array_slice($this->pathChapterIds(), 0, -1);
    }
}
