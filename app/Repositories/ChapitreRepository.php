<?php

namespace App\Repositories;


use App\Chapitre;
use Illuminate\Support\Collection;

class ChapitreRepository {
    protected $chapitre;

    public function __construct(Chapitre $chapitre) {
        $this->chapitre = $chapitre;
    }

    public function getBySlug($slug):Chapitre {
        return $this->chapitre->where('slug', $slug)->firstOrFail();
    }

    public function getByOrder($id_roman, $order):Chapitre {
        return $this->chapitre->where('roman_id', $id_roman)->where('order', $order)->firstOrFail();
    }
}