# ADR-02: Génération de slug native, sans package externe

**Date**: 2026-07-26
**Status**: Accepted

## Context

Les modèles avec URL SEO (à ce jour `Novel`, exposé via `/novels/{slug}`) ont besoin d'un slug unique généré automatiquement à la création. Le package `cviebrock/eloquent-sluggable` avait d'abord été ajouté pour ça.

## Decision

Génération de slug **native, sans dépendance externe** : un trait maison `App\Models\Concerns\HasSlug` (hook `creating`, slugify via `Str::slug`, unicité par suffixe `-2`/`-3`…, source surchargeable via `slugSource()`). Le package `cviebrock/eloquent-sluggable` a été retiré.

Règle générale sous-jacente : préférer le natif Laravel à un package externe pour un besoin simple et circonscrit ; réserver les packages aux cas à vraie valeur ajoutée (plusieurs modèles, comportements avancés).

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| `cviebrock/eloquent-sluggable` | Régénération sur update, longueur max, mots réservés, unicité en 1 requête | Dépendance externe pour un besoin simple (1 modèle) |
| **Trait natif `HasSlug` (retenu)** | Zéro dépendance, transparent, réutilisable (`use HasSlug`), suffit au besoin | À maintenir soi-même ; unicité en N requêtes (`exists()`) ; pas de régénération sur update |

## Consequences

- **Positive**: aucune dépendance ; slug figé après création (bon pour le SEO) ; réutilisable sur d'autres modèles via `use HasSlug`.
- **Negative**: fonctionnalités avancées (régénération sur update, longueur max…) à coder si un jour nécessaires.
- **Risks**: si de nombreux modèles deviennent sluggables avec des besoins avancés, réévaluer l'ajout d'un package.

## Références

- `app/Models/Concerns/HasSlug.php`
- `app/Models/Novel.php`
- `rules/files-type/model.md`
