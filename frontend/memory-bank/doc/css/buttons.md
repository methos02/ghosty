# Buttons

`.btn` + `.btn-{color}`: fond coloré, texte blanc (ou sombre pour les couleurs claires).

**Couleurs disponibles** — 18 au total, en 3 familles :
- **Primary** : `primary`, `primary-300`, `primary-400`, `primary-600`
- **Statuts** : `danger`, `danger-300`, `success`, `success-300`, `warning`, `warning-300`, `info`, `info-300`
- **Accents** : `blue`, `blue-300`, `green`, `green-300`, `red`, `yellow`

Les variantes `-300` pâles (danger, success, info, green, warning) et `yellow` ont un texte sombre automatique (`--neutral-800`).

**Alt buttons** `.btn-{color}-alt` : fond transparent + bordure colorée, prend la couleur de fond au survol. `.active` pour l'état actif.

**Ghost buttons** `.btn-ghost-{color}` : fond neutre (`--neutral-400`), prend la couleur au survol. `.active` supporté.

**Survol forcé** `.btn-{color}-active` : impose uniquement la couleur au survol/`.active` sans toucher au style de base. Se combine avec une autre classe (ex. `btn-primary btn-danger-active`).

**Disabled** : `[disabled]` applique `--neutral-500` + `cursor: not-allowed` quelle que soit la couleur.

## Icon buttons (`_btn-icon.scss`)

`.btn-icon` + `.btn-icon-{color}` : l'élément `<i>` ne porte que la classe d'icône — couleur, taille (`--fs-600`), hover et focus sont gérés par les classes du bouton.

Mêmes 18 couleurs que `.btn-{color}`. Hover automatique :
- Couleurs avec paire naturelle : `primary` ↔ `primary-300`, `blue` ↔ `blue-300`, `green` ↔ `green-300`
- Variantes `-300` de statut : hover vers la couleur base (ex. `danger-300` → `danger`)
- Autres (danger, success, warning, info, red, yellow) : `color-mix` pour éclaircir

```html
<button type="button" class="btn-icon btn-icon-primary">
  <i class="fa-solid fa-pen"></i>
</button>
```
