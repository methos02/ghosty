<?php

namespace App\Models;

use App\Enums\SanctionType;
use Database\Factories\SanctionFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 *
 * @mixin IdeHelperSanction
 */
class Sanction extends Model
{
    /** @use HasFactory<SanctionFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'moderator_id',
        'report_id',
        'type',
        'until',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'type' => SanctionType::class,
            'until' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @param  Builder<Sanction>  $query
     */
    public function scopeActiveBans(Builder $query): void
    {
        $query->where('type', '!=', SanctionType::Warning)
            ->where(fn (Builder $running) => $running
                ->whereNull('until')
                ->orWhere('until', '>', now()));
    }

    public function isPermanent(): bool
    {
        return $this->until === null;
    }
}
