<?php

namespace App\Support;

use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
 */
final readonly class TokenCookieSettings
{
    public function __construct(
        public string $name,
        public string $sessionName,
        public int $lifetime,
        public string $path,
        public ?string $domain,
        public bool $secure,
        public string $sameSite
    ) {}

    public static function fromConfig(): self
    {
        return new self(
            name: Config::string('sanctum.token_cookie.name'),
            sessionName: Config::string('sanctum.token_cookie.session_name'),
            lifetime: Config::integer('sanctum.token_cookie.lifetime'),
            path: Config::string('sanctum.token_cookie.path'),
            domain: self::domain(),
            secure: Config::boolean('sanctum.token_cookie.secure'),
            sameSite: Config::string('sanctum.token_cookie.same_site'),
        );
    }

    private static function domain(): ?string
    {
        $domain = Config::get('sanctum.token_cookie.domain');

        return is_string($domain) && $domain !== '' ? $domain : null;
    }
}
