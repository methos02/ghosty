<?php


namespace App\Repositories;

use App\Chapitre;
use App\Roman;
use App\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Auth;
use Illuminate\Support\Str;

class RomanRepository {
    protected $roman;
    protected $genreR;


    public function __construct(Roman $roman, GenreRepository $genreR) {
        $this->roman = $roman;
        $this->genreR = $genreR;
    }

    public function getTop($genre, $page):Collection {
        return $this->queryBasic($genre, $page)->orderBy('vote', 'desc')->get();
    }

    public function getLast($genre, $page):Collection {
        return $this->queryBasic($genre, $page)->orderBy('id', 'desc')->get();
    }

    public function getRandom($genre, $page):Collection {
        return $this->queryBasic($genre, $page)->inRandomOrder()->get();
    }

    public function getPopulaire($genre, $page):Collection {
        return $this->queryBasic($genre, $page)->orderBy('nb_vote', 'desc')->get();
    }

    public function getBySlug($slug):Roman {
        return $this->roman->where('slug', $slug)->firstOrFail();
    }

    public function getBy($tri, $genre, $page):Collection {
        if(Roman::PAGE[$page] == null) return null;

        if($tri === 'top')
            return $this->getTop($genre, $page);

        if($tri === 'populaire')
            return $this->getPopulaire($genre, $page);

        if($tri === 'last')
            return $this->getLast($genre, $page);

        if($tri === 'random')
            return $this->getRandom($genre, $page);

        return null;
    }

    public function queryBasic($genre, $page) :Builder {
        return $this->roman->whereHas('genre', function($query) use ($genre) {
            if($genre != 'all') {
                return $query->where('slug', $genre);
            }

            return $query;
        })->where('statut', Roman::PAGE[$page])->limit(10);
    }

    public function newBrouillon($slug_genre) {
        /** @var User $user */
        $user = Auth::user();

        $genre = $this->genreR->getBySlug($slug_genre);

        $brouillon = new Roman();
        $brouillon->titre_roman = "";
        $brouillon->genre_id = $genre->id;
        $brouillon->user_id = $user->id;
        $brouillon->slug_genre = $genre->slug_genre;
        $brouillon->name_cover = -1;
        $brouillon->cover = 'defaut/cover-vide.jpg';
        $brouillon->save();

        $first_chap = new Chapitre();
        $first_chap->user_id = $user->id;
        $first_chap->roman_id = $brouillon->id;
        $first_chap->save();

        $brouillon->genre = $genre;
        $brouillon->first = $first_chap;

        return $brouillon;
    }

    public function updateBrouillon(Roman $brouillon, Chapitre $first_chap, Array $inputs, $cover) {
        $brouillon->titre_roman = $inputs['titre_roman'];
        $brouillon->slug = Str::slug($inputs['titre_roman'], '-');
        $brouillon->cover = $cover;
        $brouillon->name_cover = $inputs['name_cover'];
        $brouillon->save();

        $first_chap->titre_chapitre = $inputs['titre_chapitre'];
        $first_chap->slug = Str::slug($inputs['titre_chapitre'], '-');
        $first_chap->recit = $inputs['recit'];
        $first_chap->resume = $inputs['resume'];
        $first_chap->statut = $inputs['update_roman'] == "Publier"? Chapitre::S_NEW : $brouillon->statut;
        $first_chap->save();
    }
}