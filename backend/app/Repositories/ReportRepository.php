<?php

namespace App\Repositories;

use App\DTO\ReportFilterDTO;
use App\Enums\ReportStatus;
use App\Models\Report;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ReportRepository
{
    public function existsFor(int $reporterId, Model $reportable): bool
    {
        return Report::where('reporter_id', $reporterId)
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
     * @return LengthAwarePaginator<int, Report>
     */
    public function paginate(ReportFilterDTO $filters, int $perPage = 25): LengthAwarePaginator
    {
        return Report::query()
            ->with(['reporter', 'reportable'])
            ->when($filters->status !== null, fn (Builder $query) => $query->where('status', $filters->status))
            ->when($filters->reason !== null, fn (Builder $query) => $query->where('reason', $filters->reason))
            ->orderBy('status')
            ->latest('created_at')
            ->paginate($perPage);
    }
}
