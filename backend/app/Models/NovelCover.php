<?php

namespace App\Models;

use App\Models\Concerns\HasComments;
use App\Models\Concerns\HasLikes;
use App\Models\Concerns\HasReports;
use App\Models\Concerns\IsNotificationSubject;
use App\Models\Contracts\Commentable;
use App\Models\Contracts\Likeable;
use App\Models\Contracts\Reportable;
use Database\Factories\NovelCoverFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 *
 * @mixin IdeHelperNovelCover
 */
class NovelCover extends Model implements Commentable, Likeable, Reportable
{
    use HasComments, HasLikes, HasReports, IsNotificationSubject;

    /** @use HasFactory<NovelCoverFactory> */
    use HasFactory;

    const STATUS_PUBLISHED = 1;

    const STATUS_HIDDEN = 3;

    const DISK = 'public';

    protected $fillable = [
        'novel_id',
        'author_id',
        'image_path',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'integer',
            'like_count' => 'integer',
            'comment_count' => 'integer',
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
     * @param  Builder<NovelCover>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', self::STATUS_PUBLISHED);
    }

    public function imageUrl(): string
    {
        return Storage::disk(self::DISK)->url($this->image_path);
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function isHidden(): bool
    {
        return $this->status === self::STATUS_HIDDEN;
    }

    public function isOpenToComments(): bool
    {
        return $this->isPublished();
    }
}
