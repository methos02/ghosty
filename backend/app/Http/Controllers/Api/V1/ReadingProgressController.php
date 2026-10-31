<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReadingProgressResource;
use App\Models\User;
use App\Repositories\ReadingProgressRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md
 */
class ReadingProgressController extends Controller
{
    public function __construct(
        private readonly ReadingProgressRepository $readingProgressesR
    ) {}

    public function index(Request $request): JsonResponse
    {
        /** @var User $reader */
        $reader = $request->user();
        $progresses = $this->readingProgressesR->paginate($reader, Config::integer('ghosty.reading.per_page'));

        return response()->json([
            'progresses' => ReadingProgressResource::collection($progresses->items()),
            'meta' => [
                'current_page' => $progresses->currentPage(),
                'per_page' => $progresses->perPage(),
                'total' => $progresses->total(),
                'last_page' => $progresses->lastPage(),
            ],
        ]);
    }
}
