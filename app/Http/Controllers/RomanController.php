<?php

namespace App\Http\Controllers;

use App\Gestion\ImageGestion;
use App\Http\Requests\{genreSlugRequest, homeRomanRequest, infosRequest, RomanRequest};
use App\Repositories\RomanRepository;
use App\User;
use Auth;
use Illuminate\Http\UploadedFile;

class RomanController extends Controller {

    private $romanR;
    protected $imgG;

    public function __construct(RomanRepository $romanR, ImageGestion $imgG)  {
        $this->romanR = $romanR;
        $this->imgG = $imgG;

        $this->middleware('ajax', ['only' => ['infos', 'htmlRoman', 'getBrouillon']]);
        $this->middleware('auth', ['only' => ['update']]);
    }

    public function infos(infosRequest $request) {
        $roman = $this->romanR->getBySlug($request->input('slug'));
        $chapitre = $roman->getChapitreByOrder(1);

        return view ('roman.info', compact('roman', 'chapitre'));
    }

    public function htmlRoman(homeRomanRequest $request) {
        $romans = $this->romanR->getBy($request->input('tri'), $request->input('genre'), $request->input('page'));

        if ($romans->isEmpty()) return '<div>Aucun roman trouvé.</div>';

        return view('html.home_roman', compact('romans'));
    }

    public function getBrouillon(GenreSlugRequest $request) {
        /** @var User $user */
        $user = Auth::user();
        $brouillon = $user->getRomanBrouillon($request->input('slug_genre'));

        if ($brouillon == null) {
            $brouillon = $this->romanR->newBrouillon($request->input('slug_genre'));
        }

        return response()->json(['brouillon' => $brouillon->getArrayAttribute()]);
    }

    public function update (RomanRequest $request) {
        /** @var User $user */
        $user = Auth::user();
        $brouillon = $user->getRomanBrouillon($request->input('slug_genre'));

        if(empty($brouillon)) {
            redirect()->route('home')->with('error', 'Genre invalide');
        }

        $first_chap = $brouillon->first();

        if($request->file('cover') instanceof UploadedFile) {
            $filename = $this->imgG->updateCover(
                $request->file('cover'),
                $brouillon->cover,
                $request->get('width'), $request->get('height'), $request->get('x'), $request->get('y')
            );
        }

        $this->romanR->updateBrouillon($brouillon, $first_chap, $request->all(), $filename ?? $brouillon->cover);
        $url = $request->has('redirect')? '/add/' . $request->input('redirect') : '/vote/all/top';

        return redirect($url)->with('success', 'le roman est publié.');
    }

    public function chapitreInVote($slug) {
        $roman = $this->romanR->getBySlug($slug);
        $chapitres = $roman->getChapitreInVote();

        return view('roman.chapitres_vote', compact('roman', 'chapitres'));
    }
}
