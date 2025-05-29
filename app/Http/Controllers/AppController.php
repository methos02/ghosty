<?php

namespace App\Http\Controllers;

use App\Repositories\GenreRepository;
use App\Repositories\RomanRepository;
use App\User;
use Illuminate\Contracts\Support\Renderable;
use App\Utils\FormCustom\FormUtils;
use Auth;

class AppController extends Controller {
    private $genreR;
    private $romanR;

    public function __construct(RomanRepository $romanR, GenreRepository $genreR)  {
        $this->romanR = $romanR;
        $this->genreR = $genreR;

        $this->middleware('auth')->only('add');
        $this->middleware('not_verified')->only('home');
    }

    /**
     * Show the application dashboard.
     *
     * @param $page
     * @param $genre
     * @param $tri
     * @return Renderable
     */
    public function home($page, $genre, $tri) {
        $romans = $this->romanR->getBy($tri, $genre, $page);
        $genres = $this->genreR->getAll()->pluck('name_genre', 'slug_genre')->toArray();
        $optionGenres = FormUtils::defineOptions($genres);
        $brouillon = 'roman_empty';

        return view(  'home.home' , compact('page', 'tri', 'romans', 'optionGenres', 'genres', 'brouillon'));
    }

    public function add($genre_brouillon = null) {
        /** @var User $user */
        $user = Auth::user();

        $genres = $this->genreR->getAll()->pluck('name_genre', 'slug_genre')->toArray();
        $optionGenres = FormUtils::defineOptions($genres);
        $brouillon = $genre_brouillon != null ? $user->getRomanBrouillon($genre_brouillon) : 'roman_empty';

        if(empty($brouillon)) {
            $brouillon = $this->romanR->newBrouillon($genre_brouillon);
        }

        return view('home.home', ['page' => 'add', 'tri' => '', 'optionGenres' => $optionGenres, 'genres' => $genres, 'brouillon' => $brouillon]);
    }

    public function cgu () { return view('cgu'); }
    public function auteurs () { return view('auteurs'); }
    public function principe () { return view('principe'); }
}
