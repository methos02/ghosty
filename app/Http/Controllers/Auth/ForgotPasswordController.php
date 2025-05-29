<?php

namespace App\Http\Controllers\Auth;

use App\Api\SendInBlue;
use App\Http\Controllers\Controller;
use App\Http\Requests\MailPasswordRequest;
use App\Repositories\UserRepository;
use Illuminate\Auth\Passwords\PasswordBroker;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\RedirectResponse;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    private $userR;
    private $mailler;

    /**
     * Create a new controller instance.
     *
     * @param UserRepository $userR
     * @param SendInBlue $sendInBlue
     */
    public function __construct(UserRepository $userR, SendInBlue $sendInBlue) {
        $this->middleware('guest');
        $this->userR = $userR;
        $this->mailler = $sendInBlue;
    }

    public function showLinkRequestForm() {
        return view('auth.connexion', ['page' => 'password']);
    }

    /**
     * @param MailPasswordRequest $request
     * @return array|RedirectResponse
     */
    public function sendResetLinkEmail(MailPasswordRequest $request)
    {
        $user = $this->userR->findByMail($request->input('email'));

        if(empty($user)) {
            return redirect()->route('password.update')->with('error', "Aucun compte n'est associé à l'adresse mail renseignée.");
        }

        $token = (app(PasswordBroker::class))->createToken($user);
        $this->mailler->sendMailResetPAssword($user, $token);

        return redirect()->route('password.request')->with('ok', 'Un mail vous a été envoyé.');
    }
}
