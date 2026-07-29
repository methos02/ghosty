<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkResource;
use App\Repositories\WorkRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    public function __construct(
        private readonly WorkRepository $worksR
    ) {}

    public function index(Request $request): JsonResponse
    {
        $works = $this->worksR->filter($request->only(['novel_slug', 'order', 'type']));

        return response()->json([
            'works' => WorkResource::collection($works->items()),
            'meta' => [
                'current_page' => $works->currentPage(),
                'per_page' => $works->perPage(),
                'total' => $works->total(),
                'last_page' => $works->lastPage(),
            ],
        ]);
    }
}
