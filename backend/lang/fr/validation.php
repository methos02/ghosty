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
    'report' => [
        'reason' => [
            'required' => 'Le motif du signalement est obligatoire',
            'enum' => 'Le motif sélectionné est invalide',
        ],
        'description' => [
            'max' => 'La description ne peut pas dépasser :max caractères',
        ],
    ],
    'moderation' => [
        'resolution' => [
            'required' => 'Choisissez une décision',
            'enum' => 'Cette décision n\'est pas possible pour ce contenu',
        ],
        'content' => [
            'required' => 'Le texte caviardé est obligatoire',
            'altered' => 'Le texte caviardé ne peut que retirer des passages, sans en ajouter ni en modifier',
            'nothing_removed' => 'Sélectionnez au moins un passage à retirer',
        ],
        'sanction' => [
            'type' => [
                'required' => 'Le type de sanction est obligatoire',
                'required_for_hidden_comment' => 'Masquer un commentaire entraîne au minimum un avertissement de son auteur',
                'enum' => 'Le type de sanction est invalide',
            ],
            'days' => [
                'integer' => 'La durée doit être un nombre de jours',
                'min' => 'La durée doit être d\'au moins :min jour',
                'max' => 'La durée ne peut pas dépasser :max jours',
            ],
            'reason' => [
                'required' => 'Indiquez le motif de la sanction',
                'max' => 'Le motif ne peut pas dépasser :max caractères',
            ],
        ],
    ],
    'report_filter' => [
        'status' => [
            'enum' => 'Le statut sélectionné est invalide',
        ],
    ],
    'draft_filter' => [
        'parent_id' => [
            'integer' => 'Le chapitre parent doit être un identifiant numérique',
        ],
        'is_root' => [
            'boolean' => 'Le filtre « chapitre racine » doit valoir vrai ou faux',
        ],
    ],
    'tree_filter' => [
        'from' => [
            'integer' => 'Le chapitre de départ doit être un identifiant numérique',
        ],
    ],
    'chapter_read' => [
        'session_key' => [
            'required' => 'La clé de session de lecture est obligatoire',
            'uuid' => 'La clé de session de lecture est invalide',
        ],
    ],
    'comment' => [
        'content' => [
            'required' => 'Le commentaire ne peut pas être vide',
            'string' => 'Le commentaire doit être un texte',
            'max' => 'Le commentaire ne peut pas dépasser :max caractères',
        ],
        'is_spoiler' => [
            'boolean' => 'L\'indication de divulgâcheur doit valoir vrai ou faux',
        ],
        'mentioned_user_id' => [
            'integer' => 'Le lecteur mentionné est invalide',
        ],
    ],
];
