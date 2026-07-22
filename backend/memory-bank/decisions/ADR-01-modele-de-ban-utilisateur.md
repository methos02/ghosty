# ADR-01: Modèle de ban utilisateur (couplage à `banned_until`)

**Date**: 2026-07-22
**Status**: Accepted

## Context

Au login, il faut déterminer si un utilisateur est banni pour bloquer l'accès et afficher un message. Le modèle `User` ne dispose que d'une colonne liée au ban : `banned_until` (date, nullable).

Le besoin d'afficher **deux messages distincts** — ban temporaire (« banni jusqu'au {date} ») et ban permanent (« banni définitivement ») — a été soulevé. Or, avec un seul champ, `banned_until = null` est **ambigu** : il signifie à la fois « pas banni » et « banni sans date de fin ». Impossible de distinguer les deux sans un second indicateur.

## Decision

Un utilisateur est considéré comme banni **uniquement** d'après `banned_until` :

- `banned_until` dans le futur → banni (temporaire) ;
- `banned_until` `null` ou date passée → non banni.

Un **seul message** est affiché (« Compte banni jusqu'au {date} »). Le **ban permanent n'est pas supporté** : il se confondrait avec l'état « non banni ».

`User::isBanned()` porte l'annotation `@phpstan-assert-if-true !null $this->banned_until`, qui garantit à PHPStan que `banned_until` est non-null lorsque `isBanned()` renvoie `true` (accès `->format()` sans `?->` dans le login).

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| Champ `banned_at` (timestamp) = indicateur « est banni », `banned_until` = date de fin (`null` = permanent) | Découple « est banni » de « jusqu'à quand » ; supporte les 2 messages ; narrowing naturel | +1 colonne + migration ; complexité non justifiée aujourd'hui |
| Booléen `is_banned` + `banned_until` | Idem, plus léger | Deux champs à garder cohérents |
| Date sentinelle far-future (ex. `9999-12-31`) pour un ban permanent | Aucun champ ajouté | Valeur magique, fragile — rejeté |
| **Couplage sur `banned_until` seul (retenu)** | Zéro champ, zéro complexité, suffit au besoin actuel | Pas de ban permanent ; `null` ambigu sémantiquement |

## Consequences

- **Positive**: modèle minimal, aucune migration ni champ supplémentaire ; logique de ban centralisée dans `User::isBanned()`.
- **Negative**: pas de ban permanent — un seul message au login.
- **Risks**: si le besoin de bans définitifs apparaît, il faudra découpler via un indicateur dédié (`banned_at`), adapter `isBanned()` et le login. Le changement reste localisé (modèle + contrôleur) et documenté ici.

## Références

- `app/Models/User.php` — `User::isBanned()`
- `app/Http/Controllers/Api/V1/AuthController.php` — `login()`
