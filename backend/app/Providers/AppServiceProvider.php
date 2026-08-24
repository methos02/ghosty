<?php

namespace App\Providers;

use App\Models\Chapter;
use App\Models\Novel;
use App\Models\User;
use App\Support\TokenCookieSettingsSupport;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Config;
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

        $this->enforceMorphMap();
        $this->resolveAccessTokenFromCookie();
        $this->defineAuthRateLimiters();
        $this->defineContentRateLimiters();
    }

    private function enforceMorphMap(): void
    {
        Relation::enforceMorphMap([
            'chapter' => Chapter::class,
            'novel' => Novel::class,
            'user' => User::class,
        ]);
    }

    /**
     * @see backend/memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
     */
    private function resolveAccessTokenFromCookie(): void
    {
        Sanctum::getAccessTokenFromRequestUsing(function (Request $request): ?string {
            $cookieToken = $request->cookie(TokenCookieSettingsSupport::fromConfig()->name);

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

    /**
     * @see backend/memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md
     */
    private function defineContentRateLimiters(): void
    {
        RateLimiter::for('like', function (Request $request): Limit {
            $perMinute = Config::integer('ghosty.likes.per_minute');

            return Limit::perMinute($perMinute)->by((string) $request->user()?->id);
        });
    }
}
