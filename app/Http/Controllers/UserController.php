<?php

namespace App\Http\Controllers;

use App\Api\SendInBlue;
use App\Gestion\ImageGestion;
use App\Http\Requests\{AvatarUpdateRequest, MaillingRequest, NotifUpdateRequest, PasswordUpdateRequest, ResetMailRequest};
use App\Repositories\UserRepository;
use App\User;
use Auth;
use Hash;

class UserController extends Controller {
    private $imgG;
    private $userR;

    public function __construct(ImageGestion $imgG, UserRepository $userR) {
        $this->imgG = $imgG;
        $this->userR = $userR;
        $this->middleware('verified')->except('mailValidate');
        $this->middleware('ajax', ['only' => 'updateAvatar']);
    }

    public function profil() {
        return view('user.profil', ['user' => Auth::user()]);
    }

    public function updateAvatar(AvatarUpdateRequest $request ) {
        /** @var User $user */
        $user = Auth::user();

        $filename = $this->imgG->updateAvatar(
            $request->file('avatar'),
            $user->avatar,
            $request->get('width'), $request->get('height'), $request->get('x'), $request->get('y')
        );

        $user->avatar = $filename;
        $user->save();

        return response()->json(
            ['path_image' => url($user->avatar_path), 'message' => 'Votre avatar a été mis à jour.'],
            200
        );
    }

    public function resetMail(ResetMailRequest $request, SendInBlue $mail) {
        $key = str_random(30);
        $result = $mail->sendMailReset($request->input('mail'), $key);

        if($result['code'] > 201) return redirect('user')->with('error', 'Problème lors de l\'envoi du mail.');

        $this->userR->addOrUpdateMailReset($request->input('mail'), $key);

        return redirect('user')->with('ok', 'Un mail vous a été envoyé pour confirmer votre changement.');
    }

    public function mailValidate($key) {
        $mail = $this->userR->getMailReset($key);

        if(empty($mail)) return redirect(auth::check()? '/user' : '/')->with('error', 'Vous n\'avez aucun mail en attente de validation');

        $user = $this->userR->find($mail->user_id);
        $user->email = $mail->mail;
        $user->save();

        $this->userR->deleteMailReset($key);

        return redirect(Auth::check()? '/user' : '/')->with('ok', 'Votre adresse a été modifiée.');
    }

    public function updateMdp(PasswordUpdateRequest $request) {
        $user = Auth::user();
        $user->password = Hash::make($request->get('new_password_1'));
        $user->save();

        return view('user.profil', ['user' => $user]);
    }

    public function updateNotif(NotifUpdateRequest $request) {
        $user = Auth::user();
        $user->notif = $request->get('notif');
        $user->save();

        return response()->json(
            ['message' => 'L\'envoi de mail pour les notifications a été ' . ($request->get('notif') == 1 ? 'activée' : 'desactivée') . '.'],
            200
        );
    }

    public function maillingRegister(MaillingRequest $request) {
        $user = Auth::user();
        $user->mailling = $request->input('mailling');
        $user->save();

        $action = $request->input('mailling') == true ? 'abonné à' : 'désabonné de';
        return redirect('user')->with('ok', 'Vous êtes ' . $action . ' la newsletter');
    }
}
