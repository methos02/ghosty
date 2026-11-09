<?php

namespace App\Models;

use App\Helpers\CoverUrlHelper;
use App\Models\Concerns\HasComments;
use App\Models\Concerns\HasSlug;
use App\Models\Concerns\IsNotificationSubject;
use App\Models\Contracts\NotificationSubject;
use Database\Factories\NovelFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @mixin IdeHelperNovel
 */
class Novel extends Model implements NotificationSubject
{
    use HasComments, HasSlug, IsNotificationSubject;

    /** @use HasFactory<NovelFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'genre_id',
        'author_id',
        'cover_url',
        'is_favorite',
        'chapter_count',
    ];

    protected function casts(): array
    {
        return [
            'is_favorite' => 'boolean',
            'comment_count' => 'integer',
            'branch_recomputed_at' => 'datetime',
        ];
    }

    public function isOpenToComments(): bool
    {
        return $this->rootChapter?->isPublished() ?? false;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function coverUrl(): string
    {
        return CoverUrlHelper::forNovel($this);
    }

    /**
     * @return BelongsTo<Genre, $this>
     */
    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return HasMany<Chapter, $this>
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class);
    }

    /**
     * @return HasOne<Chapter, $this>
     */
    public function rootChapter(): HasOne
    {
        return $this->hasOne(Chapter::class)->whereNull('parent_id');
    }
}
