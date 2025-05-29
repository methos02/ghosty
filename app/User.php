<?php

namespace App;

use App\Api\SendInBlue;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;

/**
 * @property int id
 * @property string avatar
 * @property string pseudo
 * @property string email
 * @property string password
 * @property int nb_notif
 * @property Genre genre
 */
class User extends Authenticatable implements MustVerifyEmail {
    use Notifiable;
    private $path_avatar = 'storage/avatar/';

    CONST USER = 1;
    CONST MODO = 2;
    CONST ADMIN = 3;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'pseudo', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function notifs() {
        return $this->hasMany(Notif::class);
    }

    public function romans() {
        return $this->hasMany(Roman::class);
    }

    public function notifUndelete() {
        return $this->notifs()->whereIn('statut', [Notif::S_NEW, Notif::S_VIEW])->get();
    }

    public function notifDelete() {
        return $this->notifs()->whereIn('statut', [Notif::S_SUPP])->get();
    }

    public function getRomanBrouillon($slug): ? Roman {
        return $this->romans()->where('slug_genre', $slug)->where('statut', Roman::S_BROUILLON)->first();
    }

    public function plurielNotif() {
        return $this->nb_notif > 1 ? 's' : '';
    }

    public function getAvatarPathAttribute() {
        return $this->path_avatar . $this->avatar;
    }

    public function sendEmailVerificationNotification(){
        $mailler = new SendInBlue();
        $mailler->sendMailVerif($this);
    }
}
