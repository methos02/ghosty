<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int statut
 */
class Notif extends Model {

    CONST S_SUPP = -1;
    CONST S_VIEW = 0;
    CONST S_NEW = 1;

    public function isNew() {
        return $this->statut == self::S_NEW;
    }

    public function statutView() {
        $this->statut = Notif::S_VIEW;
        $this->save();
    }
}
