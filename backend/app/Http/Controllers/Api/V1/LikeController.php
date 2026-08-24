<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Services\LikeGuard;
use App\Services\LikeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
 */
class LikeController extends Controller
{
    public function __construct(
        private readonly ChapterRepository $chaptersR,
        private readonly LikeGuard $likeGuard,
        private readonly LikeService $likeService
    ) {}

    public function store(Request $request, int $chapterId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $chapter = $this->chaptersR->find($chapterId, withoutRelations: true);

        $this->likeGuard->authorizeLike($user, $chapter);
        $this->likeService->like($user, $chapter, $request->ip());

        return response()->json([
            'is_liked' => true,
            'like_count' => $chapter->like_count,
        ]);
    }

    public function destroy(Request $request, int $chapterId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $chapter = $this->chaptersR->find($chapterId, withoutRelations: true);

        $this->likeService->unlike($user, $chapter);

        return response()->json([
            'is_liked' => false,
            'like_count' => $chapter->like_count,
        ]);
    }
}
