<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Cookie as SymfonyCookie;

/**
 * @see backend/memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
 */
class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'pseudo' => $request->pseudo,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')->toString()),
            'roles' => [User::ROLE_READER],
        ]);

        return $this->authenticated($user, 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Adresse e-mail ou mot de passe incorrect'],
            ]);
        }

        if ($user->isBanned()) {
            throw ValidationException::withMessages([
                'email' => ['Compte banni jusqu\'au '.$user->banned_until->format('d/m/Y')],
            ]);
        }

        return $this->authenticated($user);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnecté avec succès',
        ])
            ->withCookie($this->forgetCookie(config('sanctum.token_cookie.name')))
            ->withCookie($this->forgetCookie(config('sanctum.token_cookie.session_name')));
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    private function authenticated(User $user, int $status = 200): JsonResponse
    {
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
        ], $status)
            ->withCookie($this->tokenCookie($token))
            ->withCookie($this->sessionCookie());
    }

    private function tokenCookie(string $token): SymfonyCookie
    {
        return Cookie::make(
            name: config('sanctum.token_cookie.name'),
            value: $token,
            minutes: config('sanctum.token_cookie.lifetime'),
            path: config('sanctum.token_cookie.path'),
            domain: config('sanctum.token_cookie.domain'),
            secure: config('sanctum.token_cookie.secure'),
            httpOnly: true,
            sameSite: config('sanctum.token_cookie.same_site'),
        );
    }

    private function sessionCookie(): SymfonyCookie
    {
        return Cookie::make(
            name: config('sanctum.token_cookie.session_name'),
            value: '1',
            minutes: config('sanctum.token_cookie.lifetime'),
            path: config('sanctum.token_cookie.path'),
            domain: config('sanctum.token_cookie.domain'),
            secure: config('sanctum.token_cookie.secure'),
            httpOnly: false,
            sameSite: config('sanctum.token_cookie.same_site'),
        );
    }

    private function forgetCookie(string $name): SymfonyCookie
    {
        return Cookie::forget(
            name: $name,
            path: config('sanctum.token_cookie.path'),
            domain: config('sanctum.token_cookie.domain'),
        );
    }
}
