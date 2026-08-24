<?php

return [

    'chapters' => [
        'title_min_length' => 3,
        'title_max_length' => 150,
        'summary_max_length' => 500,

        /* @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md */
        'correction' => [
            'window_hours' => 48,
            'max_changed_percent' => 1,
            'min_changed_words' => 5,
        ],

        'children_per_page' => 15,
    ],

    /* @see memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md */
    'likes' => [
        'requires_verified_email' => true,
        'min_account_age_hours' => 24,
        'per_minute' => 5,
    ],

    'reports' => [
        'description_max_length' => 1000,
    ],

];
