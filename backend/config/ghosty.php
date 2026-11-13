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

    /* @see memory-bank/decisions/ADR-15-traitement-de-la-moderation.md */
    'moderation' => [
        'per_page' => 20,
        'removed_passage_marker' => '[[removed]]',
        'sanction_max_days' => 3650,
        'reason_max_length' => 1000,
    ],

    /* @see memory-bank/decisions/ADR-16-illustrations-du-roman.md */
    'covers' => [
        'max_size_kb' => 5120,
        'min_width' => 800,
        'min_height' => 450,
        'max_width' => 6000,
        'max_height' => 4000,
    ],

    /* @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md */
    'notifications' => [
        'per_page' => 20,
    ],

    /* @see memory-bank/decisions/ADR-12-suivi-de-branche-et-parcours-de-lecture.md */
    'reading' => [
        'per_page' => 20,
        'reads_per_minute' => 30,
    ],

    /* @see memory-bank/decisions/ADR-13-commentaires.md */
    'comments' => [
        'per_page' => 20,
        'content_max_length' => 2000,
        'per_minute' => 5,
    ],

];
