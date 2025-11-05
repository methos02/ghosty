<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NovelResource;
use App\Models\Novel;

class NovelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $novels = Novel::with('genre')->paginate(15);

        return NovelResource::collection($novels);
    }
}
