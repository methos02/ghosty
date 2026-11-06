<?php

namespace App\Models;

use Database\Factories\CommentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use LogicException;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 *
 * @mixin IdeHelperComment
 */
class Comment extends Model
{
    /** @use HasFactory<CommentFactory> */
    use HasFactory;

    const STATUS_VISIBLE = 1;

    const STATUS_DELETED = 2;

    const STATUS_HIDDEN = 3;

    protected $fillable = [
        'author_id',
        'commentable_type',
        'commentable_id',
        'parent_id',
        'content',
        'is_spoiler',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'reply_count' => 'integer',
            'is_spoiler' => 'boolean',
            'status' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return BelongsTo<Comment, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * @return HasMany<Comment, $this>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    /**
     * @return HasMany<Comment, $this>
     */
    public function visibleReplies(): HasMany
    {
        return $this->replies()
            ->where('status', self::STATUS_VISIBLE)
            ->oldest()
            ->orderBy('id');
    }

    public function target(): Chapter|Novel
    {
        $commentable = $this->commentable;

        if ($commentable instanceof Chapter || $commentable instanceof Novel) {
            return $commentable;
        }

        throw new LogicException(sprintf('Comment %d is attached to an unsupported commentable.', $this->id));
    }

    public function isVisible(): bool
    {
        return $this->status === self::STATUS_VISIBLE;
    }

    public function isDeleted(): bool
    {
        return $this->status === self::STATUS_DELETED;
    }

    public function startsWithMentionOf(User $user): bool
    {
        $mention = preg_quote('@'.$user->username, '/');

        return preg_match('/^'.$mention.'(\s|$)/u', $this->content ?? '') === 1;
    }

    public function isReply(): bool
    {
        return $this->parent_id !== null;
    }

    /**
     * @param  Builder<Comment>  $query
     */
    public function scopeTopLevel(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    /**
     * @param  Builder<Comment>  $query
     */
    public function scopeShownInThread(Builder $query): void
    {
        $query->where(fn (Builder $shown) => $shown
            ->where('status', self::STATUS_VISIBLE)
            ->orWhere(fn (Builder $deletedWithReplies) => $deletedWithReplies
                ->where('status', self::STATUS_DELETED)
                ->where('reply_count', '>', 0)));
    }
}
