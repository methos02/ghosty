<?php

namespace App\Http\Resources\Collections;

use App\Http\Resources\NovelResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class NovelCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var class-string<NovelResource>
     */
    public $collects = NovelResource::class;
}
