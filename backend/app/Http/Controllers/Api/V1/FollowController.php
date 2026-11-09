<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FollowResource;
use App\Models\Chapter;
use App\Models\User;
use App\Repositories\FollowRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class FollowController extends Controller
{
    public function __construct(
        private readonly FollowRepository $followsR
    ) {}

    public function index(Request $request): JsonResponse
    {
        /** @var User $follower */
        $follower = $request->user();
        $follows = $this->followsR->paginate($follower, Config::integer('ghosty.reading.per_page'));

        return response()->json([
            'follows' => FollowResource::collection($follows->items()),
            'meta' => [
                'current_page' => $follows->currentPage(),
                'per_page' => $follows->perPage(),
                'total' => $follows->total(),
                'last_page' => $follows->lastPage(),
            ],
        ]);
    }

    public function store(Request $request, Chapter $chapter): JsonResponse
    {
        /** @var User $follower */
        $follower = $request->user();

        $this->followsR->createIfAbsent($follower->id, $chapter->id);

        return response()->json(['is_followed' => true]);
    }

    public function destroy(Request $request, Chapter $chapter): JsonResponse
    {
        /** @var User $follower */
        $follower = $request->user();

        $this->followsR->delete($follower->id, $chapter->id);

        return response()->json(['is_followed' => false]);
    }
}
