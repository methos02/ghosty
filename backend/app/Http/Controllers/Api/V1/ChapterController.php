<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\ChapterDTO;
use App\DTO\DraftFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChapterRequest;
use App\Http\Requests\UpdateChapterRequest;
use App\Http\Resources\ChapterListResource;
use App\Http\Resources\ChapterResource;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Services\ChapterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    public function __construct(
        private readonly ChapterRepository $chaptersR,
        private readonly ChapterService $chapterService
    ) {}

    public function currentContinuity(string $novelSlug): JsonResponse
    {
        $chapters = $this->chaptersR->currentContinuity($novelSlug);

        return response()->json([
            'chapters' => ChapterListResource::collection($chapters),
        ]);
    }

    public function show(int $chapterId): ChapterResource
    {
        $chapter = $this->chaptersR->find($chapterId);

        return new ChapterResource($chapter);
    }

    public function children(int $chapterId): JsonResponse
    {
        $children = $this->chaptersR->children($chapterId);

        return response()->json([
            'chapters' => ChapterListResource::collection($children),
        ]);
    }

    public function store(StoreChapterRequest $request, string $novelSlug): JsonResponse
    {
        $parent = $this->chaptersR->findInNovel($request->integer('parent_id'), $novelSlug);

        $this->authorize('create', $parent);

        /** @var User $author */
        $author = $request->user();
        $created = $this->chapterService->createContinuation(
            $parent,
            $author,
            ChapterDTO::fromRequest($request)
        );

        $chapter = $this->chaptersR->find($created->id);

        return (new ChapterResource($chapter))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
     */
    public function update(UpdateChapterRequest $request, int $chapterId): ChapterResource
    {
        $chapter = $this->chaptersR->find($chapterId);

        $this->authorize('update', $chapter);

        $updated = $this->chapterService->update($chapter, ChapterDTO::fromRequest($request));

        return new ChapterResource($updated);
    }

    public function publish(int $chapterId): ChapterResource
    {
        $chapter = $this->chaptersR->find($chapterId);

        $this->authorize('publish', $chapter);

        $this->chapterService->publish($chapter);

        return new ChapterResource($this->chaptersR->find($chapterId));
    }

    public function destroy(int $chapterId): JsonResponse
    {
        $chapter = $this->chaptersR->find($chapterId);

        $this->authorize('delete', $chapter);

        $this->chapterService->delete($chapter);

        return response()->json(['message' => __('chapters.draft_discarded')]);
    }

    public function drafts(Request $request): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();
        $drafts = $this->chaptersR->draftsByOwner($author->id, DraftFilterDTO::fromRequest($request));

        return response()->json([
            'chapters' => ChapterListResource::collection($drafts),
        ]);
    }
}
