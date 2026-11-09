<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\ChapterDTO;
use App\DTO\DraftFilterDTO;
use App\DTO\TreeFilterDTO;
use App\Helpers\CurrentUserHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\DraftFilterRequest;
use App\Http\Requests\StoreChapterRequest;
use App\Http\Requests\TreeFilterRequest;
use App\Http\Requests\UpdateChapterRequest;
use App\Http\Resources\ChapterListResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\NovelResource;
use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\NovelRepository;
use App\Services\ChapterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ChapterController extends Controller
{
    public function __construct(
        private readonly ChapterRepository $chaptersR,
        private readonly NovelRepository $novelsR,
        private readonly ChapterService $chapterService,
        private readonly CurrentUserHelper $currentUserHelper
    ) {}

    public function mainBranch(Novel $novel): JsonResponse
    {
        $chapters = $this->chaptersR->mainBranch($novel->slug, $this->currentUserHelper->id());

        return response()->json([
            'chapters' => ChapterListResource::collection($chapters),
        ]);
    }

    public function show(Chapter $chapter): ChapterResource
    {
        $chapterForReader = $this->chaptersR->find($chapter->id, $this->currentUserHelper->id());

        return new ChapterResource($chapterForReader);
    }

    /**
     * @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    public function reading(Novel $novel, Chapter $chapter): JsonResponse
    {
        $userId = $this->currentUserHelper->id();
        $chapterForReader = $this->chaptersR->findInNovel($chapter->id, $novel->slug, $userId);

        $branch = $this->chaptersR->branchToFollow($chapterForReader, $userId);
        $mainBranch = $this->chaptersR->mainBranch($novel->slug);
        $novelDetailed = $this->novelsR->loadDetails($novel);

        return response()->json([
            'novel' => new NovelResource($novelDetailed),
            'chapter' => new ChapterResource($chapterForReader),
            'ancestors' => ChapterListResource::collection(
                $this->chaptersR->ancestors($chapterForReader, $userId)
            ),
            'children' => ChapterListResource::collection(
                $this->chaptersR->children($chapterForReader->id, $userId)
            ),
            'branch_chapter_ids' => $branch->pluck('id')->all(),
            'is_main_branch' => $branch->last()?->id === $mainBranch->last()?->id,
            'next_chapter_id' => $this->nextChapterIdInBranch($branch, $chapterForReader),
        ]);
    }

    public function tree(TreeFilterRequest $request, Novel $novel): JsonResponse
    {
        $novelSlug = $novel->slug;
        $fromChapterId = TreeFilterDTO::fromRequest($request)->fromChapterId;
        $userId = $this->currentUserHelper->id();
        $mainBranch = $this->chaptersR->mainBranch($novelSlug, $userId);

        $branch = $mainBranch;
        if ($fromChapterId !== null) {
            $origin = $this->chaptersR->findInNovel($fromChapterId, $novelSlug);
            $branch = $this->chaptersR->branchFromRoot($origin, $userId);
        }

        return response()->json([
            'chapters' => ChapterListResource::collection(
                $this->chaptersR->withChildren($novelSlug, $branch, $userId)
            ),
            'main_branch_ids' => $mainBranch->pluck('id')->all(),
        ]);
    }

    public function children(Chapter $chapter): JsonResponse
    {
        $children = $this->chaptersR->children($chapter->id, $this->currentUserHelper->id());

        return response()->json([
            'chapters' => ChapterListResource::collection($children),
        ]);
    }

    public function store(StoreChapterRequest $request, Novel $novel): JsonResponse
    {
        $parent = $this->chaptersR->findInNovel($request->integer('parent_id'), $novel->slug);

        $this->authorize('create', $parent);

        /** @var User $author */
        $author = $request->user();
        $created = $this->chapterService->createChild(
            $parent,
            $author,
            ChapterDTO::fromRequest($request)
        );

        $chapter = $this->chaptersR->find($created->id, $this->currentUserHelper->id());

        return (new ChapterResource($chapter))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md
     */
    public function update(UpdateChapterRequest $request, Chapter $chapter): ChapterResource
    {
        $updated = $this->chapterService->update($chapter, ChapterDTO::fromRequest($request));

        return new ChapterResource($updated);
    }

    public function publish(Chapter $chapter): ChapterResource
    {
        $this->chapterService->publish($chapter);

        $published = $this->chaptersR->find($chapter->id, $this->currentUserHelper->id());

        return new ChapterResource($published);
    }

    public function destroy(Chapter $chapter): JsonResponse
    {
        $this->chapterService->delete($chapter);

        return response()->json(['message' => __('chapters.draft_discarded')]);
    }

    public function drafts(DraftFilterRequest $request): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();
        $drafts = $this->chaptersR->draftsByOwner($author->id, DraftFilterDTO::fromRequest($request));

        return response()->json([
            'chapters' => ChapterListResource::collection($drafts),
        ]);
    }

    public function published(Request $request): JsonResponse
    {
        /** @var User $author */
        $author = $request->user();
        $novels = $this->novelsR->containingChaptersPublishedByAuthor($author->id);

        return response()->json([
            'novels' => NovelResource::collection($novels),
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
}
