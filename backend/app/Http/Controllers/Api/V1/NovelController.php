<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\ChapterDTO;
use App\DTO\NovelDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNovelRequest;
use App\Http\Requests\UpdateNovelRequest;
use App\Http\Resources\NovelResource;
use App\Models\User;
use App\Repositories\NovelRepository;
use App\Services\NovelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NovelController extends Controller
{
    public function __construct(
        private readonly NovelRepository $novelsR,
        private readonly NovelService $novelService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $novels = $this->novelsR->paginate(
            $request->string('search')->trim()->toString(),
            $request->filled('genre_id') ? $request->integer('genre_id') : null
        );

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
        $novel = $this->novelsR->findBySlug($slug);

        return new NovelResource($novel);
    }

    public function update(UpdateNovelRequest $request, string $slug): NovelResource
    {
        $novel = $this->novelsR->findBySlug($slug);

        $this->novelService->update($novel, NovelDTO::fromRequest($request));

        return new NovelResource($this->novelsR->findBySlug($slug));
    }

    public function store(StoreNovelRequest $request): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();

        $novel = $this->novelService->create(
            $author,
            NovelDTO::fromRequest($request, addPrefix: true),
            ChapterDTO::fromRequest($request, addPrefix: true)
        );

        $created = $this->novelsR->findBySlug($novel->slug);

        return (new NovelResource($created))
            ->response()
            ->setStatusCode(201);
    }
}
