<?php

namespace App;

/**
 * @property int id
 * @property int roman_id
 * @property int user_id
 * @property string titre_chapitre
 * @property string slug
 * @property string recit
 * @property string resume
 */
class Chapitre extends Oeuvre {
    CONST S_REJECT = -1;
    CONST S_NEW = 0;
    CONST S_ACCEPT = 1;
    CONST S_BROUILLON = 2;

    public $cover = 'defaut/cover-vierge.jpg';

    public function roman() {
        return $this->belongsTo(Roman::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function getTitreAttribute() {
        return $this->titre_chapitre;
    }
}
