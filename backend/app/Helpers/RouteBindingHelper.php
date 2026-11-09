<?php

namespace App\Helpers;

use App\Models\Chapter;
use Illuminate\Http\Request;
use LogicException;

final class RouteBindingHelper
{
    public function chapter(Request $request): Chapter
    {
        $chapter = $request->route('chapter');

        if (! $chapter instanceof Chapter) {
            throw new LogicException('The chapter route parameter must be bound to a Chapter.');
        }

        return $chapter;
    }
}
