<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\NovelCoverDTO;
use App\Helpers\CurrentUserHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCoverRequest;
use App\Http\Resources\CoverResource;
use App\Models\Novel;
use App\Models\NovelCover;
use App\Models\User;
use App\Repositories\NovelCoverRepository;
use App\Repositories\NovelRepository;
use App\Services\CoverService;
use Illuminate\Http\JsonResponse;

/**
 * @see memory-bank/decisions/ADR-16-illustrations-du-roman.md
 */
class CoverController extends Controller
{
    public function __construct(
        private readonly NovelCoverRepository $novelCoversR,
        private readonly NovelRepository $novelsR,
        private readonly CoverService $coverService,
        private readonly CurrentUserHelper $currentUserHelper
    ) {}

    public function index(Novel $novel): JsonResponse
    {
        $userId = $this->currentUserHelper->id();
        $covers = $this->novelCoversR->listPublishedByNovel($novel, $userId);
        $myCoverId = $userId === null ? null : $this->novelCoversR->findIdByAuthor($novel->id, $userId);

        return response()->json([
            'covers' => CoverResource::collection($covers),
            'official_cover_id' => $novel->official_cover_id,
            'my_cover_id' => $myCoverId,
        ]);
    }

    public function store(StoreCoverRequest $request, Novel $novel): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();

        if ($this->novelCoversR->findIdByAuthor($novel->id, $author->id) !== null) {
            return response()->json(['message' => __('covers.already_proposed')], 409);
        }

        $cover = $this->coverService->create($novel, $author, NovelCoverDTO::fromRequest($request));
        $coverForReader = $this->novelCoversR->find($cover->id, $author->id);

        return response()->json([
            'cover' => new CoverResource($coverForReader),
            'official_cover_id' => $this->novelsR->findOfficialCoverId($novel->id),
        ], 201);
    }

    public function replaceImage(StoreCoverRequest $request, NovelCover $cover): JsonResponse
    {
        $this->coverService->replaceImage($cover, NovelCoverDTO::fromRequest($request));
        $coverForReader = $this->novelCoversR->find($cover->id, $this->currentUserHelper->id());

        return response()->json([
            'cover' => new CoverResource($coverForReader),
            'official_cover_id' => $this->novelsR->findOfficialCoverId($cover->novel_id),
        ]);
    }
}
