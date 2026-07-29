<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Collections\GenreCollection;
use App\Repositories\GenreRepository;
use Illuminate\Support\Facades\Cache;

class GenreController extends Controller
{
    public function __construct(
        private readonly GenreRepository $genresR
    ) {}

    public function index(): GenreCollection
    {
        $genres = Cache::rememberForever('genres', fn () => $this->genresR->allOrderedByName());

        return new GenreCollection($genres);
    }

    public function clearCache(): void
    {
        Cache::forget('genres');
    }
}
