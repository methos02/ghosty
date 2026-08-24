<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\ChapterDTO;
use App\DTO\DraftFilterDTO;
use App\DTO\TreeFilterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChapterRequest;
use App\Http\Requests\UpdateChapterRequest;
use App\Http\Resources\ChapterListResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\NovelResource;
use App\Models\Chapter;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\NovelRepository;
use App\Services\ChapterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;

class ChapterController extends Controller
{
    public function __construct(
        private readonly ChapterRepository $chaptersR,
        private readonly NovelRepository $novelsR,
        private readonly ChapterService $chapterService
    ) {}

    public function currentBranch(string $novelSlug): JsonResponse
    {
        $chapters = $this->chaptersR->currentBranch($novelSlug);

        return response()->json([
            'chapters' => ChapterListResource::collection($chapters),
        ]);
    }

    public function show(int $chapterId): ChapterResource
    {
        $chapter = $this->chaptersR->find($chapterId);

        $this->abortIfUnreadable($chapter);

        return new ChapterResource($chapter);
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function reading(string $novelSlug, int $chapterId): JsonResponse
    {
        $chapter = $this->chaptersR->findInNovel($chapterId, $novelSlug);

        $this->abortIfUnreadable($chapter);

        $branch = $this->chaptersR->mostPopularBranchWithChapter($chapter);
        $currentBranch = $this->chaptersR->currentBranch($novelSlug);

        return response()->json([
            'novel' => new NovelResource($this->novelsR->findBySlug($novelSlug)),
            'chapter' => new ChapterResource($chapter),
            'ancestors' => ChapterListResource::collection($this->chaptersR->ancestorsOf($chapter)),
            'children' => ChapterListResource::collection($this->chaptersR->children($chapter->id)),
            'branch_chapter_ids' => $branch->pluck('id')->all(),
            'is_current_branch' => $branch->last()?->id === $currentBranch->last()?->id,
            'next_chapter_id' => $this->nextChapterIdInBranch($branch, $chapter),
        ]);
    }

    public function tree(Request $request, string $novelSlug): JsonResponse
    {
        $fromChapterId = TreeFilterDTO::fromRequest($request)->fromChapterId;
        $currentBranch = $this->chaptersR->currentBranch($novelSlug);

        $branch = $currentBranch;
        if ($fromChapterId !== null) {
            $origin = $this->chaptersR->findInNovel($fromChapterId, $novelSlug);
            $branch = $this->chaptersR->branchEndingWith($origin);
        }

        return response()->json([
            'chapters' => ChapterListResource::collection(
                $this->chaptersR->withChildren($novelSlug, $branch)
            ),
            'current_branch_ids' => $currentBranch->pluck('id')->all(),
        ]);
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
        $created = $this->chapterService->createChild(
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

    /**
     * @param  Collection<int, Chapter>  $branch
     */
    private function nextChapterIdInBranch(Collection $branch, Chapter $chapter): ?int
    {
        $position = $branch->search(fn (Chapter $step) => $step->id === $chapter->id);

        if ($position === false) {
            return null;
        }

        return $branch->get($position + 1)?->id;
    }

    private function abortIfUnreadable(Chapter $chapter): void
    {
        if (Gate::allows('view', $chapter)) {
            return;
        }

        abort(404);
    }
}
