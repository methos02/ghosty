<?php

namespace App\Providers;

use App\Support\TokenCookieSettings;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Schema::defaultStringLength(191);
        JsonResource::withoutWrapping();

        $this->resolveAccessTokenFromCookie();
        $this->defineAuthRateLimiters();
    }

    /**
     * @see backend/memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
     */
    private function resolveAccessTokenFromCookie(): void
    {
        Sanctum::getAccessTokenFromRequestUsing(function (Request $request): ?string {
            $cookieToken = $request->cookie(TokenCookieSettings::fromConfig()->name);

            return is_string($cookieToken) && $cookieToken !== '' ? $cookieToken : null;
        });
    }

    /**
     * @see backend/memory-bank/decisions/ADR-05-rate-limiting-des-routes-auth.md
     */
    private function defineAuthRateLimiters(): void
    {
        RateLimiter::for('login', function (Request $request): Limit {
            $identifier = $request->string('identifier')->lower()->toString();

            return Limit::perMinute(5)->by($identifier.'|'.$request->ip());
        });

        RateLimiter::for('register', function (Request $request): Limit {
            return Limit::perHour(5)->by($request->ip() ?? '');
        });
    }
}
