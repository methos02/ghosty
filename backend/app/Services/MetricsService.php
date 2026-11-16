<?php

namespace App\Services;

use App\DTO\MetricsFilterDTO;
use App\Repositories\MetricsRepository;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-18-indicateurs-du-mvp.md
 */
class MetricsService
{
    public function __construct(
        private readonly MetricsRepository $metricsR
    ) {}

    /**
     * @return array{
     *     period: array{days: int, from: CarbonInterface, to: CarbonInterface},
     *     metrics: array<string, array{count: int, total: int|null}>,
     *     inactive_after_days: int
     * }
     */
    public function compute(MetricsFilterDTO $metricsFilterDTO): array
    {
        $to = now();
        $since = $to->copy()->subDays($metricsFilterDTO->days);
        $inactiveAfterDays = Config::integer('ghosty.metrics.inactive_after_days');

        $readers = $this->metricsR->readerCountsSince($since);
        $novelReadings = $this->metricsR->novelReadingCountsSince($since);
        $authors = $this->metricsR->publishingAuthorCountsSince($since);
        $continuations = $this->metricsR->continuationCountsPublishedSince($since);
        $branches = $this->metricsR->branchCountsExtendedSince($since);
        $inactiveContinuations = $this->metricsR->inactiveContinuationCountsPublishedBefore($to->copy()->subDays($inactiveAfterDays));

        return [
            'period' => [
                'days' => $metricsFilterDTO->days,
                'from' => $since,
                'to' => $to,
            ],
            'metrics' => [
                'returning_readers' => $this->metric($readers['returning'], $readers['active']),
                'returning_authors' => $this->metric($authors['returning'], $authors['publishing']),
                'continued_continuations' => $this->metric($continuations['continued'], $continuations['published']),
                'active_branches' => $this->metric($branches['extended'], $branches['existing']),
                'alternate_branch_readers' => $this->metric($readers['alternate_branch'], $readers['active']),
                'branch_followers' => $this->metric($this->metricsR->branchFollowerCount()),
                'completed_readings' => $this->metric($novelReadings['completed'], $novelReadings['started']),
                'comments' => $this->metric($this->metricsR->commentCountSince($since)),
                'likes' => $this->metric($this->metricsR->likeCountSince($since)),
                'inactive_continuations' => $this->metric($inactiveContinuations['inactive'], $inactiveContinuations['published']),
            ],
            'inactive_after_days' => $inactiveAfterDays,
        ];
    }

    /**
     * @return array{count: int, total: int|null}
     */
    private function metric(int $count, ?int $total = null): array
    {
        return [
            'count' => $count,
            'total' => $total,
        ];
    }
}
