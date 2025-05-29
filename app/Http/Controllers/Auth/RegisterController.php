<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\RegisterRequest;
use App\Repositories\UserRepository;
use App\User;
use App\Http\Controllers\Controller;
use Auth;
use Hash;
use Illuminate\Foundation\Auth\RegistersUsers;
use Redirect;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/vote/all/top';

    /**
     * @var UserRepository
     */
    private $UserR;

    /**
     * Create a new controller instance.
     *
     * @param UserRepository $UserR
     */
    public function __construct(UserRepository $UserR) {
        $this->middleware('guest')->except('successRegister');
        $this->UserR = $UserR;
    }

    public function showRegistrationForm() {
        return view('auth.connexion', ['page' => 'register']);
    }

    public function successRegister() {
        if(!Auth::check()) return view('auth.connexion', ['page' => 'login']);

        return view('auth.verify');
    }


    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data) {
        return User::create([
            'pseudo' => $data['pseudo'],
            'email' => $data['email'],
            'mailling' => key_exists('mailling', $data),
            'password' => Hash::make($data['password']),
        ]);
    }

    public function register(RegisterRequest $request) {
        $user = $this->UserR->findByMail($request->input('email'));

        if (!empty($user)) {
            return Auth::attempt($request->only('email', 'password'))
                ? Redirect('/vote/all/top')->with('success', '<p>Cette adresse mail été déjà associée à un compte avec le même mot de passe.</p> <p>Vous avez été connecté automatiquement sous le pseudo ' . $user->pseudo . '</p>')
                : Redirect::route('reset.password.show')->with('alert', "<p>Votre adresse mail est déjà associée à un compte. </p><p> En cas d'oublie de votre mot de passe, veuillez suivre la procédure de réinitialisation.</p>");
        }

        $user = $this->create($request->all());
        $user->sendEmailVerificationNotification();

        return Auth::attempt($request->only('email', 'password'))
            ? Redirect::route('register.success')->with('title', 'Inscription réussie.')
            : Redirect::route('login')->with('error', 'problème de connection.');
    }
}
