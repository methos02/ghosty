<?php

namespace App\Repositories;

use App\Notif;
use DB;

class NotifRepository {
    protected $notif;

    public function __construct(Notif $notif) {
        $this->notif = $notif;
    }

    public function getById($id):Notif {
        return $this->notif->where('id', $id)->firstOrFail();
    }

    public function deleteById(Array $ids) {
        DB::table('notifs')->whereIn('id', $ids)->update(['statut' => Notif::S_SUPP]);
    }

    public function destroyById(Array $ids) {
        DB::table('notifs')->whereIn('id', $ids)->delete();;
    }

    public function recupById(Array $ids) {
        DB::table('notifs')->whereIn('id', $ids)->update(['statut' => Notif::S_VIEW]);
    }

    public function determineCountNewNotif(Array $ids) {
        return DB::table('notifs')->whereIn('id', $ids)->where('statut', Notif::S_NEW)->count();
    }
}