<?php

use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Laravel\Sanctum\Http\Middleware\AuthenticateSession;

return [

    'stateful' => explode(',', (string) env('SANCTUM_STATEFUL_DOMAINS', 'localhost:5173')),

    'guard' => ['web'],

    'expiration' => null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Token Cookie
    |--------------------------------------------------------------------------
    |
    | @see memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
    |
    */

    'token_cookie' => [
        'name' => env('SANCTUM_TOKEN_COOKIE', 'ghosty_token'),
        'session_name' => env('SANCTUM_SESSION_COOKIE', 'ghosty_session'),
        'lifetime' => (int) env('SANCTUM_TOKEN_COOKIE_LIFETIME', 60 * 24 * 30),
        'path' => env('SANCTUM_TOKEN_COOKIE_PATH', '/'),
        'domain' => env('SANCTUM_TOKEN_COOKIE_DOMAIN'),
        'secure' => (bool) env('SANCTUM_TOKEN_COOKIE_SECURE', true),
        'same_site' => env('SANCTUM_TOKEN_COOKIE_SAME_SITE', 'lax'),
    ],

    'middleware' => [
        'authenticate_session' => AuthenticateSession::class,
        'encrypt_cookies' => EncryptCookies::class,
        'validate_csrf_token' => PreventRequestForgery::class,
    ],

];
