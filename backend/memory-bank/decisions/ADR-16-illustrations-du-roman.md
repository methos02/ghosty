# ADR-16: Illustrations du roman — proposition unique, soutien unique, officielle automatique

**Date**: 2026-11-09
**Status**: Accepted

## Context

Le MVP §10 limite l'illustration au roman entier : un illustrateur propose une couverture, « une illustration proposée n'est jamais automatiquement officielle », « le roman peut sélectionner une identité visuelle officielle ». Le plan (lot 7) confiait ce choix à l'auteur du roman.

Ce choix manuel reproduit le parti pris écarté pour les chapitres ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)) : l'auteur du roman deviendrait juge du travail des illustrateurs, et un roman abandonné figerait son illustration. Deux autres risques étaient ouverts : un même contributeur noyant les illustrations du roman sous ses variantes, et un lecteur soutenant toutes les propositions, ce qui ne classe rien.

## Decision

**1. L'illustration officielle est automatique : la plus soutenue.** `novels.official_cover_id` désigne la proposition visible au plus grand nombre de soutiens. Comme pour la branche principale, une proposition ne détrône l'officielle qu'avec un nombre de soutiens **strictement supérieur** ; à égalité l'officielle en place reste. Sans officielle (première proposition, officielle masquée), la plus soutenue puis la plus ancienne est élue. Sans aucune proposition visible, le roman affiche l'image par défaut de son genre. L'élection est recalculée **à chaque événement** qui peut la changer (proposition, remplacement, soutien, retrait de soutien, masquage, rétablissement) : un roman a peu d'illustrations, une requête suffit. Cela remplace « jamais automatiquement officielle » du MVP §10 : le soutien de la communauté est l'arbitre, pas l'auteur du roman.

**2. Une proposition par contributeur et par roman** (`UNIQUE (novel_id, author_id)`). Le contributeur peut **remplacer** son image ; la proposition remplacée **perd tous ses soutiens** (lignes `likes` supprimées, `like_count` remis à zéro) : un soutien vaut pour une image, pas pour un auteur. Les commentaires restent. Une proposition masquée par la modération ne peut pas être remplacée.

**3. Un soutien par lecteur et par roman.** Soutenir une autre illustration du même roman y **déplace** le soutien. Il n'existe pas de soutien négatif ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)) ; le signalement reste le seul canal négatif. Garde-fous identiques aux chapitres (`LikeAuthorizationService`) : pas d'auto-soutien, email vérifié, ancienneté, compte non banni, proposition visible.

**4. Tout compte connecté peut proposer**, sauf sous `write_ban` ou `account_ban`. Le rôle `illustrator` (rôles cumulables, MVP §13) est ajouté au compte à sa première proposition : il sert au profil (lot 8), jamais à une autorisation. Le roman doit être ouvert (chapitre d'origine publié).

**5. L'image est validée, pas transformée.** jpg, png ou webp, 5 Mo maximum, format paysage (affiché en 16/9, recadré par `object-fit: cover`) et dimensions bornées (`config('ghosty.covers')`), stockée telle quelle sur le disque `public` (`Storage::disk('public')`, dossier `covers/{novel_id}`). Aucune dépendance de traitement d'image. Un remplacement supprime l'ancien fichier. Le navigateur prépare l'image avant l'envoi : recadrage 16/9 choisi par le contributeur (cadrage centré par défaut), réduction à 1920 px de large au plus, export JPEG (`OffscreenCanvas`, sans librairie) ; une image qui ne donne pas 800 px de large en 16/9 est refusée avant l'envoi.

**6. Statuts.** `published` (1) ou `hidden` (3, modération). Il n'y a pas d'état « archivé » : une proposition non retenue reste une alternative visible parmi les illustrations du roman, à son rang.

**7. Interactions.** Soutiens, commentaires ([ADR-13](ADR-13-commentaires.md), une illustration devient un `commentable`), signalement et modération ([ADR-15](ADR-15-traitement-de-la-moderation.md) : `dismissed` ou `hidden` + sanction de l'auteur, rétablissement possible). Notifications ([ADR-10](ADR-10-notifications-in-app-agregees.md)) : `cover_selected` à l'illustrateur dont la proposition devient officielle (jamais de notification de perte) et `like_received` sur une illustration.

**8. `novels.cover_url` ne sert plus que de repli au jeu de démo.** L'URL servie par l'API est celle de l'officielle, puis `cover_url`, puis l'image du genre.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Officielle = la plus soutenue (retenu)** | Aucun arbitre partial ; un roman abandonné reste vivant ; cohérent avec la branche principale | Une illustration médiocre mais populaire l'emporte ; dépend du `LikeAuthorizationService` |
| Choix par l'auteur du roman (MVP §10, plan) | Contrôle éditorial | L'auteur juge le travail des illustrateurs ; roman abandonné figé |
| Plus soutenue, l'auteur peut épingler | Compromis | Réintroduit l'arbitrage, deux sources de vérité |
| Plusieurs propositions par contributeur | Liberté | Un contributeur noie les illustrations du roman et disperse ses soutiens |
| Plusieurs soutiens par lecteur | Comme les chapitres | Soutenir tout ne classe rien ; le classement des illustrations est un choix entre alternatives exclusives |
| Redimensionnement serveur (lib d'image) | Images homogènes et légères | Dépendance à ajouter ; non nécessaire au volume du MVP |

## Consequences

- **Positive**: aucune décision humaine n'est requise pour qu'un roman ait une illustration ; les illustrations d'un roman restent lisibles (une proposition par personne) ; le classement reflète un choix.
- **Negative**: les images ne sont pas normalisées (poids, taille) ; le front doit les contraindre à l'affichage. `php artisan storage:link` devient une étape de déploiement.
- **Risks**: le soutien unique par roman fait de l'illustration un vote : sa manipulation est surveillée comme celle des chapitres (motif `like_manipulation`).

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §10, §13
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — lot 7
- [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md), [ADR-13](ADR-13-commentaires.md), [ADR-15](ADR-15-traitement-de-la-moderation.md)
