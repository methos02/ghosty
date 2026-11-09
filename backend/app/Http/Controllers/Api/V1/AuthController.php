<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\TokenCookieSettingsHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Sanction;
use App\Models\User;
use App\Repositories\UserRepository;
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
    public function __construct(
        private readonly UserRepository $usersR
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->usersR->create([
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

        $user = $this->usersR->findByEmailOrUsername($identifier);

        if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['Pseudo, e-mail ou mot de passe incorrect'],
            ]);
        }

        $accountBan = $user->accountBan();

        if ($accountBan !== null) {
            throw ValidationException::withMessages([
                'identifier' => [$this->banMessage($accountBan)],
            ]);
        }

        return $this->authenticated($user);
    }

    /**
     * @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md
     */
    private function banMessage(Sanction $accountBan): string
    {
        if ($accountBan->until === null) {
            return __('moderation.banned_permanently');
        }

        return __('moderation.banned_until', ['date' => $accountBan->until->format('d/m/Y')]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();

        $settings = TokenCookieSettingsHelper::fromConfig();

        return response()->json([
            'message' => 'Déconnecté avec succès',
        ])
            ->withCookie($settings->forget($settings->name))
            ->withCookie($settings->forget($settings->sessionName));
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
        $settings = TokenCookieSettingsHelper::fromConfig();

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
        $settings = TokenCookieSettingsHelper::fromConfig();

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
}
