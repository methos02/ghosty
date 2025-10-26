<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GenreResource;
use App\Models\Genre;
use Illuminate\Support\Facades\Cache;

class GenreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $genres = Cache::rememberForever('genres', function () {
            return Genre::orderBy('name')->get();
        });

        return GenreResource::collection($genres);
    }

    /**
     * Clear the genres cache.
     */
    public function clearCache(): void
    {
        Cache::forget('genres');
    }
}
