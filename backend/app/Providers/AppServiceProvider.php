<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
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
            $cookieToken = $request->cookie(config('sanctum.token_cookie.name'));

            return is_string($cookieToken) && $cookieToken !== '' ? $cookieToken : null;
        });
    }

    /**
     * @see backend/memory-bank/decisions/ADR-05-rate-limiting-des-routes-auth.md
     */
    private function defineAuthRateLimiters(): void
    {
        RateLimiter::for('login', function (Request $request): Limit {
            return Limit::perMinute(5)->by(Str::lower($request->input('email', '')).'|'.$request->ip());
        });

        RateLimiter::for('register', function (Request $request): Limit {
            return Limit::perHour(5)->by($request->ip());
        });
    }
}
