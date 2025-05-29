<?php

namespace App\Repositories;

use App\MailReset;
use App\User;
use Auth;
use DB;

class UserRepository {
    protected $user;

    public function __construct(User $user) {
        $this->user = $user;
    }

    public function find($id):User {
        return $this->user->findOrFail($id);
    }

    public function findByMail($mail): ? User {
        return $this->user->where('email', $mail)->first();
    }

    public function save($pseudo, $mail) {
        $this->user->pseudo = $pseudo;
        $this->user->email = $mail;

        $this->user->save();
    }

    public function getMailReset($key) {
        return DB::table('mails_reset')->where('key', $key)->first();
    }

    public function notif($key) {
        return DB::table('mails_reset')->where('key', $key)->first();
    }

    public function addOrUpdateMailReset($mail, $key) {
        return MailReset::updateOrCreate(['user_id' => Auth::user()->id], ['mail' => $mail, 'key' => $key]);
    }

    public function deleteMailReset($key) {
        DB::table('mails_reset')->where('key', '=', $key)->delete();
    }

    public function decreaseNotif($nb = 1) {
        $user = Auth::user();
        $user->nb_notif = $user->nb_notif - $nb;
        $user->save();
    }
}