# ADR-20: Identité stable du compte, pseudo modifiable et gestion du compte

**Date**: 2026-11-16
**Status**: Accepted

## Context

Le lot 10 permet à un utilisateur de modifier son pseudo, son email, son mot de passe et son avatar, et de supprimer son compte. Jusqu'ici le pseudo (`users.username`) servait à la fois de nom affiché, d'identifiant de connexion, d'adresse du profil (`/users/{username}`) et de cible des mentions, écrites en texte en tête d'une réponse (`@pseudo …`, reconnues par `Comment::startsWithMentionOf`). Rendre le pseudo modifiable casserait les liens de profil et figerait l'ancien nom dans les mentions.

Le projet n'envoie aucun email : pas de vérification d'adresse, pas de « mot de passe oublié ».

## Decision

### 1. Un identifiant fixe, distinct du pseudo

- `users.slug` : 6 caractères `[a-z0-9]`, aléatoire, unique, généré à l'inscription (nouveau tirage en cas de collision), **jamais modifié**. Il ne dérive pas du pseudo : un changement de pseudo ne laisse aucune trace de l'ancien nom dans l'adresse.
- `profile_slug` = `{slug}-{Str::slug(username)}` (ex. `d4sfq7-plume`), calculé, jamais stocké. C'est l'adresse publique du profil.
- Le pseudo devient modifiable. Il reste **unique sans tenir compte de la casse** : il sert à la connexion et protège contre l'usurpation.

### 2. Adresse du profil

- API : `GET /users/{slug}` et ses listes (`/novels`, `/chapters`, `/branches`, `/covers`, `/report`) se résolvent par le **slug seul** (`{user:slug}`).
- Front : route `/users/:profileSlug`. Le slug est la partie avant le premier `-`. Si le `profile_slug` de l'URL diffère du `profile_slug` actuel du profil, le front remplace l'URL par la bonne (redirection 301 au SSR) et, **si la partie nom était présente et différente**, affiche un encart « Le pseudo de ce compte a changé », sans jamais afficher l'ancien pseudo.
- Toute ressource qui expose un utilisateur (auteur d'un roman, d'un chapitre, d'une illustration, d'un commentaire, signaleur, profil, utilisateur connecté) expose `slug` et `profile_slug` à côté de `username`. Les données de notification stockent `profile_slug` à côté du pseudo : un ancien `profile_slug` reste valide grâce à la redirection.

### 3. Mentions enregistrées par identifiant

- `comments.mentioned_user_id` (nullable, → `users.id`). Le contenu enregistré **ne contient plus** le préfixe `@pseudo`.
- `POST` d'une réponse : `content` sans préfixe et `mentioned_user_id` optionnel. La mention n'est retenue que si l'utilisateur participe au fil (règle actuelle de `CommentService::findMentionedUser`), sinon elle est ignorée.
- `CommentResource` expose `mentioned_user: {id, username, slug, profile_slug, is_deleted} | null`. Le front affiche `@{pseudo actuel}` lié au profil : un renommage met à jour toutes les mentions.

### 4. Gestion du compte : `/me/account`

Toutes les routes exigent l'authentification ; les changements sensibles exigent le **mot de passe actuel** (`current_password`), à défaut de confirmation par email.

| Méthode | Route | Corps | Effet |
|---|---|---|---|
| `GET` | `/me/account/username-availability?username=` | — | `{ available: bool }`, insensible à la casse, son propre pseudo est disponible |
| `POST` | `/me/account/profile` | multipart : `username`, `image` facultative (jpg/jpeg/png/webp) | met à jour ; une `image` remplace l'avatar ; rend `UserResource` |
| `PUT` | `/me/account/notifications` | `notifications_enabled`, `disabled_notification_types` (liste des types coupés) | rend `UserResource` |
| `PUT` | `/me/account/email` | `email`, `current_password` | email unique, rend `UserResource` |
| `PUT` | `/me/account/password` | `current_password`, `password`, `password_confirmation` | révoque les **autres** jetons du compte, garde la session courante, `204` |
| `DELETE` | `/me/account/avatar` | — | supprime le fichier, rend `UserResource` |
| `DELETE` | `/me/account` | `current_password` | anonymise le compte (§5), révoque tous les jetons, efface le cookie, `204` |

Le pseudo suit les règles de l'inscription (3 à 50 caractères). Le mot de passe suit celles de l'inscription (8 caractères minimum, confirmé). Les routes sensibles sont limitées en débit (`throttle`).

`UserResource` expose `avatar_url` (URL publique ou `null`) en plus des champs existants, ainsi que `slug` et `profile_slug`.

### 5. Supprimer un compte, c'est l'anonymiser

Les contenus d'un compte supprimé restent publiés : d'autres auteurs ont poursuivi ses chapitres, et retirer un chapitre poursuivi casserait leurs branches ([ADR-15](ADR-15-traitement-de-la-moderation.md)).

- `users.deleted_at` est posé ; `username` devient `deleted-{slug}`, `email` devient `deleted-{slug}@ghosty.invalid`, le mot de passe est remplacé par une valeur aléatoire ; l'avatar (fichier compris) est effacé.
- Ses suivis, sa progression de lecture et ses notifications sont supprimés ; ses lectures (`chapter_reads`) perdent leur `user_id`. Ses soutiens et ses contenus restent.
- Partout où il est exposé, un compte supprimé porte `is_deleted: true` ; le front affiche « Compte supprimé », sans lien. Son profil répond `404`. Il ne peut plus se connecter.

### 6. Avatar

Stocké sur le disque public, `avatars/{user_id}/`, comme les illustrations ([ADR-16](ADR-16-illustrations-du-roman.md)) ; taille maximale `ghosty.avatars.max_size_kb`. Le front recadre en carré avant l'envoi.

### 7. Précisions de mise en œuvre

- Le préfixe de pseudo `deleted-` est réservé (422), pour qu'un compte anonymisé n'entre jamais en collision avec un pseudo choisi.
- L'avatar s'envoie avec le profil, en `POST` multipart (PHP ne lit pas un corps multipart en `PATCH`) : un seul « Enregistrer » côté front.
- `POST /me/account/profile` est partiel : un champ absent reste inchangé.
- Préférences de notification : `notifications_enabled` coupe tout d'un coup, `users.disabled_notification_types` coupe type par type (`NotificationService::push` lit `User::wantsNotification()`). `content_moderated` n'est jamais coupable : l'auteur doit savoir que son contenu a été retiré.
- Le prénom, le nom et la date de naissance hérités du legacy sont retirés de `users` : rien ne les affichait ni ne les utilisait, et une donnée personnelle sans usage ne se collecte pas.
- Peuvent être mentionnés l'auteur du commentaire principal et les auteurs des réponses visibles du fil ; jamais un compte supprimé.
- Un compte supprimé est exposé avec `username` = « Compte supprimé » (`User::displayName()`), jamais avec son pseudo technique `deleted-{slug}`.
- Changer d'email ne remet pas `email_verified_at` à zéro : sans envoi d'email, l'adresse ne pourrait plus être revérifiée.
- La fiche de modération d'un compte supprimé (`/moderation/users/{id}`) reste accessible, pour l'historique des sanctions.
- Les URL `/me/account` sensibles sont limitées à 5 requêtes par minute, la vérification de disponibilité du pseudo à 30.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Slug aléatoire + pseudo modifiable (retenu)** | Liens stables ; l'ancien pseudo n'apparaît plus | URL moins parlante, compensée par le nom dans le `profile_slug` |
| Pseudo non modifiable | Aucun changement de modèle | Une erreur de pseudo est définitive |
| Slug dérivé du pseudo initial | URL lisible | Révèle l'ancien pseudo pour toujours |
| Confirmation du changement d'email par lien | Plus sûr | Exige l'envoi d'emails, absent du MVP |
| Effacement réel du compte et de ses contenus | Simple à expliquer | Casse les branches poursuivies par d'autres |

## Consequences

- **Positive** : un profil garde la même adresse pour toujours ; les mentions suivent le pseudo actuel ; un compte supprimé ne laisse plus de données personnelles.
- **Negative** : les notifications déjà émises gardent le pseudo affiché au moment de leur création. Un lien enregistré hors de Ghosty garde l'ancien nom dans son texte.
- **Migration** : `0001` (users) et `0014` (comments) sont modifiées sur place, comme aux lots précédents ; la base locale se reconstruit (`migrate:fresh --seed`).

## Références

- [ADR-15](ADR-15-traitement-de-la-moderation.md), [ADR-16](ADR-16-illustrations-du-roman.md), [ADR-17](ADR-17-profils-et-signalement-utilisateur.md)
