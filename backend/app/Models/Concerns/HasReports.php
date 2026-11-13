<?php

namespace App\Models\Concerns;

use App\Models\Report;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 *
 * @mixin Model
 */
trait HasReports
{
    /**
     * @return MorphMany<Report, $this>
     */
    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    /**
     * @param  Builder<static>  $query
     */
    public function scopeWithUserReport(Builder $query, ?int $userId): void
    {
        $query->addSelect([
            'is_reported' => static::userReportQuery($userId),
        ]);
    }

    /**
     * @return Builder<Report>
     */
    public static function userReportQuery(?int $userId): Builder
    {
        $reportable = static::query()->getModel();

        return Report::query()
            ->selectRaw('1')
            ->whereColumn('reportable_id', $reportable->getQualifiedKeyName())
            ->where('reportable_type', $reportable->getMorphClass())
            ->where('reporter_id', $userId ?? 0)
            ->limit(1);
    }
}
