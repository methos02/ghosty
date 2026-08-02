<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChapterResource;
use App\Repositories\ChapterRepository;
use Illuminate\Http\JsonResponse;

class ChapterController extends Controller
{
    public function __construct(
        private readonly ChapterRepository $chaptersR
    ) {}

    public function mainContinuity(string $novelSlug): JsonResponse
    {
        $chapters = $this->chaptersR->mainContinuity($novelSlug);

        return response()->json([
            'chapters' => ChapterResource::collection($chapters),
        ]);
    }

    public function show(int $chapterId): ChapterResource
    {
        $chapter = $this->chaptersR->findWithRelations($chapterId);

        return new ChapterResource($chapter);
    }

    public function children(int $chapterId): JsonResponse
    {
        $children = $this->chaptersR->children($chapterId);

        return response()->json([
            'chapters' => ChapterResource::collection($children),
        ]);
    }
}
