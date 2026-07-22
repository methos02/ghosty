<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Collections\GenreCollection;
use App\Models\Genre;
use Illuminate\Support\Facades\Cache;

class GenreController extends Controller
{
    public function index(): GenreCollection
    {
        $genres = Cache::rememberForever('genres', function () {
            return Genre::orderBy('name')->get();
        });

        return new GenreCollection($genres);
    }

    public function clearCache(): void
    {
        Cache::forget('genres');
    }
}
