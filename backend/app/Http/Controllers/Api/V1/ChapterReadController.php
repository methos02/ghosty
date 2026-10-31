<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChapterReadRequest;
use App\Http\Resources\ChapterReadResource;
use App\Models\User;
use App\Repositories\ChapterReadRepository;
use App\Repositories\ChapterRepository;
use App\Services\ReadingService;
use App\Support\AuthSupport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Gate;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class ChapterReadController extends Controller
{
    public function __construct(
        private readonly ChapterRepository $chaptersR,
        private readonly ChapterReadRepository $chapterReadsR,
        private readonly ReadingService $readingService,
        private readonly AuthSupport $authSupport
    ) {}

    public function index(Request $request): JsonResponse
    {
        /** @var User $reader */
        $reader = $request->user();
        $reads = $this->chapterReadsR->paginate($reader, Config::integer('ghosty.reading.per_page'));

        return response()->json([
            'reads' => ChapterReadResource::collection($reads->items()),
            'meta' => [
                'current_page' => $reads->currentPage(),
                'per_page' => $reads->perPage(),
                'total' => $reads->total(),
                'last_page' => $reads->lastPage(),
            ],
        ]);
    }

    public function store(StoreChapterReadRequest $request, int $chapterId): Response
    {
        $chapter = $this->chaptersR->find($chapterId, withoutRelations: true);

        if (Gate::denies('view', $chapter)) {
            abort(404);
        }

        $this->readingService->registerRead(
            $chapter,
            $this->authSupport->id(),
            $request->string('session_key')->toString()
        );

        return response()->noContent();
    }
}
