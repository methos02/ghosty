<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\ModerationDecisionDTO;
use App\DTO\ReportFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\ModerateChapterRequest;
use App\Http\Requests\ModerateCommentRequest;
use App\Http\Requests\ModerateCoverRequest;
use App\Http\Requests\ReportFilterRequest;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\CoverResource;
use App\Http\Resources\ModeratedCommentResource;
use App\Http\Resources\ReportedContentResource;
use App\Http\Resources\ReportResource;
use App\Http\Resources\SanctionResource;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Contracts\Reportable;
use App\Models\NovelCover;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\CommentRepository;
use App\Repositories\NovelCoverRepository;
use App\Repositories\ReportRepository;
use App\Repositories\SanctionRepository;
use App\Services\ModerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
 */
class ModerationController extends Controller
{
    public function __construct(
        private readonly ReportRepository $reportsR,
        private readonly ChapterRepository $chaptersR,
        private readonly CommentRepository $commentsR,
        private readonly NovelCoverRepository $novelCoversR,
        private readonly SanctionRepository $sanctionsR,
        private readonly ModerationService $moderationService
    ) {}

    public function index(ReportFilterRequest $request): JsonResponse
    {
        $reportedContents = $this->reportsR->paginateReportedContents(
            ReportFilterDTO::fromRequest($request),
            Config::integer('ghosty.moderation.per_page')
        );

        return response()->json([
            'reported_contents' => ReportedContentResource::collection($reportedContents->items()),
            'meta' => [
                'current_page' => $reportedContents->currentPage(),
                'per_page' => $reportedContents->perPage(),
                'total' => $reportedContents->total(),
                'last_page' => $reportedContents->lastPage(),
            ],
        ]);
    }

    public function showChapter(Chapter $chapter): JsonResponse
    {
        $chapterWithContext = $this->chaptersR->find($chapter->id);

        return response()->json($this->moderationCase($chapterWithContext, [
            'chapter' => new ChapterResource($chapterWithContext),
            'is_removable' => $chapterWithContext->isRemovableByModeration(),
        ]));
    }

    public function showComment(Comment $comment): JsonResponse
    {
        $commentWithContext = $this->commentsR->find($comment->id);

        return response()->json($this->moderationCase($commentWithContext, [
            'comment' => new ModeratedCommentResource($commentWithContext),
        ]));
    }

    /**
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     */
    public function showCover(NovelCover $cover): JsonResponse
    {
        $coverWithContext = $this->novelCoversR->find($cover->id);

        return response()->json($this->moderationCase($coverWithContext, [
            'cover' => new CoverResource($coverWithContext),
        ]));
    }

    public function moderateCover(ModerateCoverRequest $request, NovelCover $cover): JsonResponse
    {
        /** @var User $moderator */
        $moderator = $request->user();
        $pendingReports = $this->reportsR->listPending($cover);

        if ($pendingReports->isEmpty()) {
            return response()->json(['message' => __('moderation.already_processed')], 409);
        }

        $this->moderationService->moderateCover($moderator, $cover, $pendingReports, ModerationDecisionDTO::fromRequest($request));

        return response()->json(['message' => __('moderation.decided')]);
    }

    public function restoreCover(NovelCover $cover): JsonResponse
    {
        $this->moderationService->restoreCover($cover);

        return response()->json(['message' => __('moderation.restored')]);
    }

    public function moderateChapter(ModerateChapterRequest $request, Chapter $chapter): JsonResponse
    {
        /** @var User $moderator */
        $moderator = $request->user();
        $pendingReports = $this->reportsR->listPending($chapter);

        if ($pendingReports->isEmpty()) {
            return response()->json(['message' => __('moderation.already_processed')], 409);
        }

        $this->moderationService->moderateChapter($moderator, $chapter, $pendingReports, ModerationDecisionDTO::fromRequest($request));

        return response()->json(['message' => __('moderation.decided')]);
    }

    public function moderateComment(ModerateCommentRequest $request, Comment $comment): JsonResponse
    {
        /** @var User $moderator */
        $moderator = $request->user();
        $pendingReports = $this->reportsR->listPending($comment);

        if ($pendingReports->isEmpty()) {
            return response()->json(['message' => __('moderation.already_processed')], 409);
        }

        $this->moderationService->moderateComment($moderator, $comment, $pendingReports, ModerationDecisionDTO::fromRequest($request));

        return response()->json(['message' => __('moderation.decided')]);
    }

    public function restoreChapter(Chapter $chapter): JsonResponse
    {
        $this->moderationService->restoreChapter($chapter);

        return response()->json(['message' => __('moderation.restored')]);
    }

    public function restoreComment(Comment $comment): JsonResponse
    {
        $this->moderationService->restoreComment($comment);

        return response()->json(['message' => __('moderation.restored')]);
    }

    /**
     * @param  array<string, mixed>  $content
     * @return array<string, mixed>
     */
    private function moderationCase(Reportable $reportable, array $content): array
    {
        $reports = $this->reportsR->listByReportable($reportable);
        $authorSanctions = $this->sanctionsR->listByUser($reportable->author);

        return [
            ...$content,
            'reports' => ReportResource::collection($reports),
            'author_sanctions' => SanctionResource::collection($authorSanctions),
        ];
    }
}
