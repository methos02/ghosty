<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\CommentDTO;
use App\Helpers\CurrentUserHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentReplyRequest;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Chapter;
use App\Models\Comment;
use App\Models\Contracts\Commentable;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use App\Repositories\CommentRepository;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-13-commentaires.md
 */
class CommentController extends Controller
{
    public function __construct(
        private readonly CommentRepository $commentsR,
        private readonly CommentService $commentService,
        private readonly CurrentUserHelper $currentUserHelper
    ) {}

    public function indexForChapter(Chapter $chapter): JsonResponse
    {
        return $this->thread($chapter);
    }

    public function indexForNovel(Novel $novel): JsonResponse
    {
        if (! $novel->isOpenToComments()) {
            abort(404);
        }

        return $this->thread($novel);
    }

    /**
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     */
    public function indexForCover(NovelCover $cover): JsonResponse
    {
        return $this->thread($cover);
    }

    public function storeForCover(StoreCommentRequest $request, NovelCover $cover): JsonResponse
    {
        return $this->store($request, $cover);
    }

    public function storeForChapter(StoreCommentRequest $request, Chapter $chapter): JsonResponse
    {
        return $this->store($request, $chapter);
    }

    public function storeForNovel(StoreCommentRequest $request, Novel $novel): JsonResponse
    {
        return $this->store($request, $novel);
    }

    public function storeReply(StoreCommentReplyRequest $request, Comment $comment): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();

        $reply = $this->commentService->createReply($author, $comment, CommentDTO::fromRequest($request));

        return response()->json([
            'comment' => new CommentResource($reply),
            'comment_count' => $comment->target()->comment_count,
        ], 201);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        $this->commentService->delete($comment);

        return response()->json([
            'comment_count' => $comment->target()->comment_count,
        ]);
    }

    private function thread(Commentable $commentable): JsonResponse
    {
        $comments = $this->commentsR->paginateThread($commentable, Config::integer('ghosty.comments.per_page'), $this->currentUserHelper->id());

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

    private function store(StoreCommentRequest $request, Commentable $commentable): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();

        $comment = $this->commentService->create($author, $commentable, CommentDTO::fromRequest($request));

        return response()->json([
            'comment' => new CommentResource($comment),
            'comment_count' => $commentable->comment_count,
        ], 201);
    }
}
