<?php
namespace App;

use App\Utils\Convert;

/**
 * @property int id
 * @property int genre_id
 * @property string titre_roman
 * @property string slug
 * @property int user_id
 * @property string slug_genre
 * @property string cover
 * @property int name_cover
 */
class Roman extends Oeuvre {
    CONST S_REJECT = -1;
    CONST S_BROUILLON = 0;
    CONST S_VOTE = 1;
    CONST S_WRITE = 2;
    CONST S_FINI = 10;

    CONST PAGE = ['vote' => self::S_VOTE, 'continu' =>  self::S_WRITE, 'add' => null];

    protected $table = 'romans';

    public function genre() {
        return $this->belongsTo(Genre::class);
    }

    public function chapitres() {
        return $this->hasMany(Chapitre::class);
    }

    public function covers() {
        return $this->hasMany(Cover::class);
    }

    public function getChapitreByOrder($number): Chapitre {
        return $this->chapitres()->where('order', $number)->first();
    }

    public function first(): Chapitre {
        return $this->getChapitreByOrder(1);
    }

    public function getChapitreInVote() {
        return $this->chapitres()->where('statut_chap', Chapitre::S_NEW)->get();
    }

    public function getTitreAttribute() {
        return $this->name_cover == 1? $this->titre_roman : '';
    }

    public function nbNextChapitre() {
        return Convert::intToStr($this->nb_suite + 1);
    }

    public function afficheCoverName() {
        return $this->titre_roman != '' && $this->cover != 'cover-vide.jpg';
    }

    public function getArrayAttribute() {
        return array_merge($this->getAttributes(), $this->first()->getAttributes(), $this->genre->getAttributes());
    }

    public function withFirstAndGenre(){
        return [
            $this,
            $this->first(),
            $this->genre,
        ];
    }
}
