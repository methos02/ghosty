<?php

return [
    'register' => [
        'pseudo' => [
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
];
