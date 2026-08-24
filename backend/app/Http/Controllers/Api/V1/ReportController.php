<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\ReportFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\ReportRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class ReportController extends Controller
{
    public function __construct(
        private readonly ChapterRepository $chaptersR,
        private readonly ReportRepository $reportsR
    ) {}

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Report::class);

        $reports = $this->reportsR->paginate(ReportFilterDTO::fromRequest($request));

        return response()->json([
            'reports' => ReportResource::collection($reports->items()),
            'meta' => [
                'current_page' => $reports->currentPage(),
                'per_page' => $reports->perPage(),
                'total' => $reports->total(),
                'last_page' => $reports->lastPage(),
            ],
        ]);
    }

    /**
     * @throws AuthorizationException
     */
    public function storeForChapter(StoreReportRequest $request, int $chapterId): JsonResponse
    {
        /** @var User $reporter */
        $reporter = $request->user();
        $chapter = $this->chaptersR->find($chapterId, withoutRelations: true);

        if ($reporter->isBanned()) {
            throw new AuthorizationException(__('reports.denied.banned'));
        }

        if ($reporter->id === $chapter->author_id) {
            throw new AuthorizationException(__('reports.denied.own_chapter'));
        }

        if ($this->reportsR->existsFor($reporter->id, $chapter)) {
            return response()->json(['message' => __('reports.denied.already_reported')], 409);
        }

        $this->reportsR->create(
            $reporter->id,
            $chapter,
            $request->string('reason')->toString(),
            $request->filled('description') ? $request->string('description')->toString() : null
        );

        return response()->json(['message' => __('reports.created')], 201);
    }
}
