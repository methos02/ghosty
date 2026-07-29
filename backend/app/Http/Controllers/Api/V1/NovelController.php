<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NovelResource;
use App\Repositories\NovelRepository;
use Illuminate\Http\JsonResponse;

class NovelController extends Controller
{
    public function __construct(
        private readonly NovelRepository $novelsR
    ) {}

    public function index(): JsonResponse
    {
        $novels = $this->novelsR->paginateWithRelations();

        return response()->json([
            'novels' => NovelResource::collection($novels->items()),
            'meta' => [
                'current_page' => $novels->currentPage(),
                'per_page' => $novels->perPage(),
                'total' => $novels->total(),
                'last_page' => $novels->lastPage(),
            ],
        ]);
    }

    public function show(string $slug): NovelResource
    {
        $novel = $this->novelsR->findBySlugWithRelations($slug);

        return new NovelResource($novel);
    }
}
