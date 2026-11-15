<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\CurrentUserHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\CoverResource;
use App\Http\Resources\NovelResource;
use App\Http\Resources\ProfileChapterResource;
use App\Http\Resources\UserProfileResource;
use App\Models\User;
use App\Repositories\ChapterRepository;
use App\Repositories\NovelCoverRepository;
use App\Repositories\NovelRepository;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-17-profils-et-signalement-utilisateur.md
 */
class UserController extends Controller
{
    public function __construct(
        private readonly UserRepository $usersR,
        private readonly NovelRepository $novelsR,
        private readonly ChapterRepository $chaptersR,
        private readonly NovelCoverRepository $novelCoversR,
        private readonly CurrentUserHelper $currentUserHelper
    ) {}

    public function show(User $user): UserProfileResource
    {
        $profile = $this->usersR->findProfile($user->id, $this->currentUserHelper->id());

        return new UserProfileResource($profile);
    }

    public function novels(User $user): JsonResponse
    {
        $novels = $this->novelsR->paginateByAuthor($user->id, Config::integer('ghosty.profiles.per_page'));

        return response()->json([
            'novels' => NovelResource::collection($novels->items()),
            'meta' => $this->paginationMeta($novels),
        ]);
    }

    public function chapters(User $user): JsonResponse
    {
        $chapters = $this->chaptersR->paginateByAuthor($user->id, Config::integer('ghosty.profiles.per_page'));

        return response()->json([
            'chapters' => ProfileChapterResource::collection($chapters->items()),
            'meta' => $this->paginationMeta($chapters),
        ]);
    }

    public function branches(User $user): JsonResponse
    {
        $continuedChapters = $this->chaptersR->paginateContinuedByAuthor($user->id, Config::integer('ghosty.profiles.per_page'));

        return response()->json([
            'chapters' => ProfileChapterResource::collection($continuedChapters->items()),
            'meta' => $this->paginationMeta($continuedChapters),
        ]);
    }

    public function covers(User $user): JsonResponse
    {
        $covers = $this->novelCoversR->paginatePublishedByAuthor($user->id, Config::integer('ghosty.profiles.per_page'));

        return response()->json([
            'covers' => CoverResource::collection($covers->items()),
            'meta' => $this->paginationMeta($covers),
        ]);
    }

    /**
     * @param  LengthAwarePaginator<int, covariant mixed>  $paginator
     * @return array{current_page: int, per_page: int, total: int, last_page: int}
     */
    private function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ];
    }
}
