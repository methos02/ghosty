<?php

namespace App\Repositories;

use App\DTO\ReportFilterDTO;
use App\Enums\ReportResolution;
use App\Enums\ReportStatus;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Report;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ReportRepository
{
    public function exists(int $reporterId, Model $reportable): bool
    {
        return Report::query()
            ->where('reporter_id', $reporterId)
            ->where('reportable_type', $reportable->getMorphClass())
            ->where('reportable_id', $reportable->getKey())
            ->exists();
    }

    public function create(int $reporterId, Model $reportable, string $reason, ?string $description): Report
    {
        return Report::create([
            'reporter_id' => $reporterId,
            'reportable_type' => $reportable->getMorphClass(),
            'reportable_id' => $reportable->getKey(),
            'reason' => $reason,
            'description' => $description,
            'status' => ReportStatus::Pending,
        ]);
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     *
     * @return LengthAwarePaginator<int, Report>
     */
    public function paginateReportedContents(ReportFilterDTO $filters, int $perPage): LengthAwarePaginator
    {
        $reportedContents = Report::query()
            ->select(['reportable_type', 'reportable_id'])
            ->selectRaw('count(*) as report_count')
            ->selectRaw('group_concat(distinct reason) as reasons')
            ->selectRaw('min(created_at) as first_reported_at')
            ->with('reportable')
            ->where('status', $filters->status ?? ReportStatus::Pending)
            ->when($filters->reason !== null, fn (Builder $query) => $query->where('reason', $filters->reason))
            ->groupBy('reportable_type', 'reportable_id')
            ->orderByRaw('min(created_at)')
            ->paginate($perPage);

        (new Collection($reportedContents->items()))->loadMorph('reportable', [
            Chapter::class => ['author', 'novel'],
            Comment::class => ['author', 'commentable'],
        ]);

        return $reportedContents;
    }

    /**
     * @return Collection<int, Report>
     */
    public function listByReportable(Model $reportable): Collection
    {
        return Report::query()
            ->with('reporter')
            ->where('reportable_type', $reportable->getMorphClass())
            ->where('reportable_id', $reportable->getKey())
            ->orderBy('status')
            ->latest()
            ->orderByDesc('id')
            ->get();
    }

    /**
     * @return Collection<int, Report>
     */
    public function listPending(Model $reportable): Collection
    {
        return Report::query()
            ->with('reporter')
            ->pending()
            ->where('reportable_type', $reportable->getMorphClass())
            ->where('reportable_id', $reportable->getKey())
            ->oldest()
            ->orderBy('id')
            ->get();
    }

    /**
     * @param  Collection<int, Report>  $reports
     */
    public function markProcessed(Collection $reports, int $moderatorId, ReportResolution $resolution): void
    {
        Report::query()
            ->whereKey($reports->modelKeys())
            ->update([
                'status' => ReportStatus::Processed,
                'moderator_id' => $moderatorId,
                'resolution' => $resolution,
                'processed_at' => now(),
            ]);
    }
}
