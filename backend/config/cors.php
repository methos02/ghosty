<?php

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'http://app.ghosty.local:5173')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    | @see memory-bank/decisions/ADR-04-token-en-cookie-httponly.md
    */
    'supports_credentials' => true,

];
