<?php

namespace App\Models;

use App\Enums\ReportReason;
use App\Enums\ReportResolution;
use App\Enums\ReportStatus;
use Database\Factories\ReportFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 *
 * @property-read User $reporter
 *
 * @mixin IdeHelperReport
 */
class Report extends Model
{
    /** @use HasFactory<ReportFactory> */
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'reportable_type',
        'reportable_id',
        'reason',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => ReportStatus::class,
            'reason' => ReportReason::class,
            'resolution' => ReportResolution::class,
            'processed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function reportable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @param  Builder<Report>  $query
     */
    public function scopePending(Builder $query): void
    {
        $query->where('status', ReportStatus::Pending);
    }

    public function isPending(): bool
    {
        return $this->status === ReportStatus::Pending;
    }
}
