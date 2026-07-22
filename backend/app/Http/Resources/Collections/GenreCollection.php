<?php

namespace App\Http\Resources\Collections;

use App\Http\Resources\GenreResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class GenreCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var class-string<GenreResource>
     */
    public $collects = GenreResource::class;
}
