<?php
namespace App\Repositories;

use App\Genre;

class GenreRepository {
    protected $genre;

    public function __construct(Genre $genre) {
        $this->genre = $genre;
    }

    public function getAll() {
        return $this->genre->all();
    }

    public function getBySlug ($slug_genre) {
        return $this->genre->where('slug_genre', $slug_genre)->first();
    }
}