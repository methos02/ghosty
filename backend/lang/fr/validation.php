<?php

return [
    'register' => [
        'username' => [
            'required' => 'Le pseudo est obligatoire',
            'min' => 'Le pseudo doit contenir au moins 3 caractères',
            'unique' => 'Ce pseudo est déjà utilisé',
        ],
        'email' => [
            'required' => 'L\'email est obligatoire',
            'email' => 'L\'email doit être valide',
            'unique' => 'Cet email est déjà utilisé',
        ],
        'password' => [
            'required' => 'Le mot de passe est obligatoire',
            'min' => 'Le mot de passe doit contenir au moins 8 caractères',
            'confirmed' => 'Les mots de passe ne correspondent pas',
        ],
    ],
    'novel' => [
        'title' => [
            'required' => 'Le titre du roman est obligatoire',
            'min' => 'Le titre doit contenir au moins :min caractères',
        ],
        'genre' => [
            'required' => 'Le genre est obligatoire',
            'exists' => 'Le genre sélectionné est invalide',
        ],
    ],
    'chapter' => [
        'parent' => [
            'required' => 'Le chapitre à poursuivre est obligatoire',
            'exists' => 'Le chapitre à poursuivre est introuvable',
        ],
        'title' => [
            'required' => 'Le titre du chapitre est obligatoire',
            'min' => 'Le titre doit contenir au moins :min caractères',
        ],
        'content' => [
            'required' => 'Le texte du chapitre est obligatoire',
        ],
        'summary' => [
            'required' => 'Le résumé du chapitre est obligatoire',
            'max' => 'Le résumé ne peut pas dépasser :max caractères',
        ],
        'correction' => [
            'too_many' => 'Trop de mots modifiés : une correction ne doit pas changer le récit, seulement le corriger',
        ],
    ],
];
