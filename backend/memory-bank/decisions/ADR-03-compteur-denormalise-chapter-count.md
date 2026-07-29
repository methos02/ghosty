# ADR-03: Compteur de chapitres dénormalisé (`novels.chapter_count`)

**Date**: 2026-07-26
**Status**: Accepted

## Context

La liste et la fiche d'un roman affichent le nombre de chapitres. La donnée est dérivable de la table `works` (chapitres liés au roman).

## Decision

Stocker le compte dans une **colonne dénormalisée** `novels.chapter_count`, lue directement par `NovelResource` (pas de `withCount`). Contrepartie **obligatoire** : le compteur doit être maintenu de façon **centralisée** (observer `Work` ou service d'acceptation/suppression de chapitre) — cf. la règle `rules/files-type/model.md` (« Denormalized counters must be maintained »).

C'est bien de la **dénormalisation** (donnée dérivée dupliquée pour la perf de lecture), pas de la normalisation.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| `withCount('chapters')` (dérivé) | Toujours exact, zéro maintenance | Sous-requête à chaque lecture |
| **Colonne `chapter_count` (retenu)** | Lecture directe, la plus rapide ; cohérent avec le schéma cible (`vote_count`, `comment_count`, `favorites_count`) | À maintenir (`increment`/`decrement`) sous peine de dérive |

## Consequences

- **Positive**: lecture rapide, une colonne ; s'aligne avec les autres compteurs prévus au schéma.
- **Negative**: maintenance manuelle obligatoire du compteur.
- **Risks**: dérive si un chemin d'ajout/suppression de chapitre oublie d'ajuster le compteur → centraliser la mise à jour (observer/service), ne jamais la disperser.

## Références

- `app/Models/Novel.php` — `chapter_count`
- `database/seeders/WorkSeeder.php` — initialisation du compteur au seed
- `rules/files-type/model.md`
