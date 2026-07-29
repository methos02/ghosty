<?php

namespace App\Repositories;

use App\Models\Genre;
use Illuminate\Database\Eloquent\Collection;

class GenreRepository
{
    /**
     * @return Collection<int, Genre>
     */
    public function allOrderedByName(): Collection
    {
        return Genre::orderBy('name')->get();
    }
}
