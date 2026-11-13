<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CoverResource;
use App\Models\Chapter;
use App\Models\NovelCover;
use App\Models\User;
use App\Repositories\NovelCoverRepository;
use App\Repositories\NovelRepository;
use App\Services\CoverLikeService;
use App\Services\LikeAuthorizationService;
use App\Services\LikeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class LikeController extends Controller
{
    public function __construct(
        private readonly LikeAuthorizationService $likeAuthorizationService,
        private readonly LikeService $likeService,
        private readonly CoverLikeService $coverLikeService,
        private readonly NovelCoverRepository $novelCoversR,
        private readonly NovelRepository $novelsR
    ) {}

    public function storeForChapter(Request $request, Chapter $chapter): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->likeAuthorizationService->authorize($user, $chapter);
        $this->likeService->like($user, $chapter, $request->ip());

        return response()->json([
            'is_liked' => true,
            'like_count' => $chapter->like_count,
        ]);
    }

    public function destroyForChapter(Request $request, Chapter $chapter): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->likeService->unlike($user, $chapter);

        return response()->json([
            'is_liked' => false,
            'like_count' => $chapter->like_count,
        ]);
    }

    /**
     * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
     */
    public function storeForCover(Request $request, NovelCover $cover): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->likeAuthorizationService->authorize($user, $cover);
        $previouslyLikedCover = $this->coverLikeService->like($user, $cover, $request->ip());
        $likedCover = $this->novelCoversR->find($cover->id, $user->id);
        $movedFromCover = $previouslyLikedCover === null ? null : $this->novelCoversR->find($previouslyLikedCover->id, $user->id);

        return response()->json([
            'cover' => new CoverResource($likedCover),
            'moved_from' => $movedFromCover === null ? null : new CoverResource($movedFromCover),
            'official_cover_id' => $this->novelsR->findOfficialCoverId($cover->novel_id),
        ]);
    }

    public function destroyForCover(Request $request, NovelCover $cover): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->coverLikeService->unlike($user, $cover);
        $unlikedCover = $this->novelCoversR->find($cover->id, $user->id);

        return response()->json([
            'cover' => new CoverResource($unlikedCover),
            'official_cover_id' => $this->novelsR->findOfficialCoverId($cover->novel_id),
        ]);
    }
}
