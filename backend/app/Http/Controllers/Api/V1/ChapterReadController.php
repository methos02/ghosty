<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\CurrentUserHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChapterReadRequest;
use App\Http\Resources\ChapterReadResource;
use App\Models\Chapter;
use App\Models\User;
use App\Repositories\ChapterReadRepository;
use App\Services\ReadingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class ChapterReadController extends Controller
{
    public function __construct(
        private readonly ChapterReadRepository $chapterReadsR,
        private readonly ReadingService $readingService,
        private readonly CurrentUserHelper $currentUserHelper
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

    public function store(StoreChapterReadRequest $request, Chapter $chapter): Response
    {
        $this->readingService->registerRead(
            $chapter,
            $this->currentUserHelper->id(),
            $request->string('session_key')->toString()
        );

        return response()->noContent();
    }
}
