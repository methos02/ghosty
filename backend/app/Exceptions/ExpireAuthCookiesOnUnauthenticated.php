<?php

namespace App\Exceptions;

use App\Support\TokenCookieSettingsSupport;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @see memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
 */
final class ExpireAuthCookiesOnUnauthenticated
{
    public function __invoke(AuthenticationException $exception, Request $request): ?JsonResponse
    {
        $settings = TokenCookieSettingsSupport::fromConfig();

        if (! $request->expectsJson() || ! $this->hasAuthCookies($request, $settings)) {
            return null;
        }

        return response()->json(['message' => $exception->getMessage()], 401)
            ->withCookie($settings->forget($settings->name))
            ->withCookie($settings->forget($settings->sessionName));
    }

    private function hasAuthCookies(Request $request, TokenCookieSettingsSupport $settings): bool
    {
        return $request->cookies->has($settings->name) || $request->cookies->has($settings->sessionName);
    }
}
