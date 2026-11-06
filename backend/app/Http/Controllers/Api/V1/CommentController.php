<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\CommentDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentReplyRequest;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\CommentRepository;
use App\Repositories\NovelRepository;
use App\Services\CommentService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Gate;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentController extends Controller
{
    public function __construct(
        private readonly CommentRepository $commentsR,
        private readonly ChapterRepository $chaptersR,
        private readonly NovelRepository $novelsR,
        private readonly CommentService $commentService
    ) {}

    public function indexForChapter(int $chapterId): JsonResponse
    {
        $chapter = $this->chaptersR->find($chapterId, withoutRelations: true);

        if (Gate::denies('view', $chapter)) {
            abort(404);
        }

        return $this->thread($chapter);
    }

    public function indexForNovel(string $slug): JsonResponse
    {
        $novel = $this->novelsR->findBySlug($slug);

        if (! $novel->isOpenToComments()) {
            abort(404);
        }

        return $this->thread($novel);
    }

    /**
     * @throws AuthorizationException
     */
    public function storeForChapter(StoreCommentRequest $request, int $chapterId): JsonResponse
    {
        $chapter = $this->chaptersR->find($chapterId, withoutRelations: true);

        return $this->store($request, $chapter);
    }

    /**
     * @throws AuthorizationException
     */
    public function storeForNovel(StoreCommentRequest $request, string $slug): JsonResponse
    {
        $novel = $this->novelsR->findBySlug($slug);

        return $this->store($request, $novel);
    }

    /**
     * @throws AuthorizationException
     */
    public function storeReply(StoreCommentReplyRequest $request, int $commentId): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();
        $parent = $this->commentsR->find($commentId);

        $this->authorize('reply', $parent);

        $reply = $this->commentService->createReply($author, $parent, CommentDTO::fromRequest($request));
        $commentCount = $this->commentService->findCommentCount($parent->target());

        return response()->json([
            'comment' => new CommentResource($reply),
            'comment_count' => $commentCount,
        ], 201);
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(int $commentId): JsonResponse
    {
        $comment = $this->commentsR->find($commentId);

        $this->authorize('delete', $comment);

        $this->commentService->delete($comment);
        $commentCount = $this->commentService->findCommentCount($comment->target());

        return response()->json([
            'comment_count' => $commentCount,
        ]);
    }

    private function thread(Chapter|Novel $commentable): JsonResponse
    {
        $comments = $this->commentsR->paginateThread($commentable, Config::integer('ghosty.comments.per_page'));

        return response()->json([
            'comments' => CommentResource::collection($comments->items()),
            'meta' => [
                'current_page' => $comments->currentPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
                'last_page' => $comments->lastPage(),
            ],
        ]);
    }

    /**
     * @throws AuthorizationException
     */
    private function store(StoreCommentRequest $request, Chapter|Novel $commentable): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();

        $this->authorize('create', [Comment::class, $commentable]);

        $comment = $this->commentService->create($author, $commentable, CommentDTO::fromRequest($request));
        $commentCount = $this->commentService->findCommentCount($commentable);

        return response()->json([
            'comment' => new CommentResource($comment),
            'comment_count' => $commentCount,
        ], 201);
    }
}
