<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\User;
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
        private readonly LikeService $likeService
    ) {}

    public function store(Request $request, Chapter $chapter): JsonResponse
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

    public function destroy(Request $request, Chapter $chapter): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->likeService->unlike($user, $chapter);

        return response()->json([
            'is_liked' => false,
            'like_count' => $chapter->like_count,
        ]);
    }
}
