<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\MetricsFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\MetricsFilterRequest;
use App\Services\MetricsService;
use Illuminate\Http\JsonResponse;

/**
 * @see memory-bank/decisions/ADR-18-indicateurs-du-mvp.md
 */
class MetricsController extends Controller
{
    public function __construct(
        private readonly MetricsService $metricsService
    ) {}

    public function index(MetricsFilterRequest $request): JsonResponse
    {
        $metrics = $this->metricsService->compute(MetricsFilterDTO::fromRequest($request));

        return response()->json([
            'period' => [
                'days' => $metrics['period']['days'],
                'from' => $metrics['period']['from']->toIso8601String(),
                'to' => $metrics['period']['to']->toIso8601String(),
            ],
            'metrics' => $metrics['metrics'],
            'inactive_after_days' => $metrics['inactive_after_days'],
        ]);
    }
}
