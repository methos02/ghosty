<?php

return [

    'chapters' => [
        'title_min_length' => 3,
        'title_max_length' => 150,
        'summary_max_length' => 500,

        /* @see memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md */
        'proofreading' => [
            'window_hours' => 48,
            'max_changed_percent' => 1,
            'min_changed_words' => 5,
        ],

        'children_per_page' => 15,

        'displayed_depth' => 20,
    ],

];
