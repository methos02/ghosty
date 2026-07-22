<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Collections\NovelCollection;
use App\Models\Novel;

class NovelController extends Controller
{
    public function index(): NovelCollection
    {
        $novels = Novel::with('genre')->paginate(15);

        return new NovelCollection($novels);
    }
}
