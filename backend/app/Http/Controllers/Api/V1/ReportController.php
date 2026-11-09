<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\User;
use App\Repositories\ReportRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ReportController extends Controller
{
    public function __construct(
        private readonly ReportRepository $reportsR
    ) {}

    /**
     * @throws AuthorizationException
     */
    public function storeForChapter(StoreReportRequest $request, Chapter $chapter): JsonResponse
    {
        return $this->store($request, $chapter);
    }

    /**
     * @throws AuthorizationException
     */
    public function storeForComment(StoreReportRequest $request, Comment $comment): JsonResponse
    {
        if (! $comment->isVisible()) {
            abort(404);
        }

        return $this->store($request, $comment);
    }

    /**
     * @throws AuthorizationException
     */
    private function store(StoreReportRequest $request, Chapter|Comment $reportable): JsonResponse
    {
        /** @var User $reporter */
        $reporter = $request->user();

        if ($reporter->isBanned()) {
            throw new AuthorizationException(__('reports.denied.banned'));
        }

        if ($reporter->id === $reportable->author_id) {
            throw new AuthorizationException(__('reports.denied.own_content'));
        }

        if ($this->reportsR->exists($reporter->id, $reportable)) {
            return response()->json(['message' => __('reports.denied.already_reported')], 409);
        }

        $this->reportsR->create(
            $reporter->id,
            $reportable,
            $request->string('reason')->toString(),
            $request->filled('description') ? $request->string('description')->toString() : null
        );

        return response()->json(['message' => __('reports.created')], 201);
    }
}
