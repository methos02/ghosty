<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePasswordRequest;
use App\User;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Auth;
use Hash;
use Illuminate\Http\Request;
use Redirect;

class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected $redirectTo = '/vote/all/top';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('resetProfilPassword');
    }

    public function showResetForm(Request $request, $token = null) {
        return view('auth.reset_password', ['token' => $token, 'email' => $request->input('email')]);
    }

    protected function sendResetResponse(Request $request, $response)
    {
        return redirect($this->redirectPath())
            ->with([
                'status' => trans($response),
                'ok' => 'Votre mot de passe à été modifié et vous avez été automatiquement connecté.'
            ]);
    }

    public function resetProfilPassword(UpdatePasswordRequest $request) {
        if (!Hash::check($request->input('password'), Auth::user()->password)) {
            return Redirect::back()->withErrors(['password' => "Erreur de mot de passe"]);
        }

        $this->resetPassword(User::findOrFail(Auth::id()), $request->input('new_password_1'));

        return Redirect()->route('profil');
    }
}
