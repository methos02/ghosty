<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\TokenCookieSettingsSupport;
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
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')->toString()),
            'roles' => [User::ROLE_READER],
        ]);

        return $this->authenticated($user, 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $identifier = $request->string('identifier')->toString();

        $user = User::query()->where('email', $identifier)->first()
            ?? User::query()->where('username', $identifier)->first();

        if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['Pseudo, e-mail ou mot de passe incorrect'],
            ]);
        }

        if ($user->isBanned()) {
            throw ValidationException::withMessages([
                'identifier' => ['Compte banni jusqu\'au '.$user->banned_until->format('d/m/Y')],
            ]);
        }

        return $this->authenticated($user);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();

        $settings = TokenCookieSettingsSupport::fromConfig();

        return response()->json([
            'message' => 'Déconnecté avec succès',
        ])
            ->withCookie($this->forgetCookie($settings->name))
            ->withCookie($this->forgetCookie($settings->sessionName));
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
        $settings = TokenCookieSettingsSupport::fromConfig();

        return Cookie::make(
            name: $settings->name,
            value: $token,
            minutes: $settings->lifetime,
            path: $settings->path,
            domain: $settings->domain,
            secure: $settings->secure,
            httpOnly: true,
            sameSite: $settings->sameSite,
        );
    }

    private function sessionCookie(): SymfonyCookie
    {
        $settings = TokenCookieSettingsSupport::fromConfig();

        return Cookie::make(
            name: $settings->sessionName,
            value: '1',
            minutes: $settings->lifetime,
            path: $settings->path,
            domain: $settings->domain,
            secure: $settings->secure,
            httpOnly: false,
            sameSite: $settings->sameSite,
        );
    }

    private function forgetCookie(string $name): SymfonyCookie
    {
        $settings = TokenCookieSettingsSupport::fromConfig();

        return Cookie::forget(
            name: $name,
            path: $settings->path,
            domain: $settings->domain,
        );
    }
}
