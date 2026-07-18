---
paths:
  - "src/views/Documentation/**/*DocumentPage.vue"
  - "src/config/documentations/pages/*.js"
---
# Documentation Page

User docs explain what is **not** visible on screen. Do not paraphrase the UI.

## Content

**First rule — no tautology.** Never write what an element does when its label already says it. An « Enregistrer » button saves, « Annuler » cancels, « Charger plus » loads more results — **do not document it**. Same for: visible badges, obvious labels, displayed dates, reader info already visible in the window. The screenshot + its legend are enough.

Document **only** what the user cannot guess:
- side effects (update of other screens, notification sent)
- real-time / multi-user propagation
- invisible constraints (character limit, required field, expected format)
- multi-screen interactions (where it lands, what it triggers in cascade)
- trace in the history / audit log

Simple test before writing a paragraph: *« does this sentence teach something that is not already on the screenshot? »* If not, delete it.

## Markers

Marker text = **one short sentence** identifying the element (« Bouton pour transférer la demande à un autre service. »). Any detail — real-time propagation, history tracing, invisible constraints, side effects — belongs to a dedicated paragraph of the section, not to the legend.

- **Anchor to a developed section**: if a marker matches a section that develops the subject, wrap the sentence in a link: `<a href="#section-id" class="link-underline color-primary pointer">…</a>`.
- **`markers: []` is valid**: when the intro paragraph and the screenshot are enough to understand the screen, do not pad with markers. A figure without a legend is acceptable.
- **Never mark**:
  - standard buttons whose label is universal (Cancel, Close, Back),
  - constraints already visible in the field (placeholder « 200 caractères max », hint under the input, required label with `*`),
  - behaviors obvious from the interaction (cascading selection visible when picking a site),
  - implementation details (lazy loading, cache, internal pagination).

### BAD

```js
markers: [
  { number: 1, selector: '#button-cancel', description: "Ferme le formulaire sans persister." },
  { number: 2, selector: '[name="detail"]', description: "Champ obligatoire, 200 caractères max." },
  { number: 3, selector: '#button-transfer', description: "Le transfert est propagé en temps réel à tous les utilisateurs et inscrit dans l'historique avec opérateur, canal et raison." },
]
```

### GOOD

```js
markers: [
  { number: 1, selector: '#button-transfer', description: "Bouton pour transférer la demande à un autre service." },
]
```

```vue
<li>
  <span class="documentation-marker">1</span>
  <span>
    Bouton pour <a href="#transferer-vers-un-autre-service" class="link-underline color-primary pointer">transférer la demande à un autre service</a>.
  </span>
</li>
```

## Structure

- `DocumentationComponent` injects the table of contents **immediately before the first `.h2`** (see `src/components/DocumentationComponent.vue`). To keep the ToC at the top, the first `<h2>` must follow the intro paragraph directly. Any overview figure/legend goes **under** an h2 (e.g. "Vue d'ensemble"), never between the intro and the first h2.
- Sub-screens reachable only from a parent dialog (forms, tabs) are merged into the parent page using `<h3>` sub-sections — set `parentPage` in the page config. A separate doc page is justified **only** when the sub-screen has its own route.
- When consolidating: also remove the orphan Vue page, its file in `src/config/documentations/pages/`, its entry in `src/config/documentations/index.js`, and its route in `src/config/routes-config.js`.

## BAD

```vue
<h1>Détail d'une demande</h1>
<p>Intro…</p>
<figure><img /><figcaption>…</figcaption></figure>  <!-- ToC pushed below -->
<h2 class="h2" id="actions">Actions</h2>
<p>Le bouton « Enregistrer » permet d'enregistrer la demande.
   Le bouton « Annuler » permet d'annuler la saisie.
   Le statut s'affiche sous forme de badge en bas à gauche.</p>
<!-- ↑ tautologies + screenshot paraphrase: delete -->
```

## GOOD

```vue
<h1>Détail d'une demande</h1>
<p>Intro…</p>
<h2 class="h2" id="vue-d-ensemble">Vue d'ensemble</h2>  <!-- ToC sits here -->
<figure><img /><figcaption>…</figcaption></figure>
<h2 class="h2" id="enregistrer">Enregistrer</h2>
<p>L'enregistrement déclenche une notification à l'auteur référent et
   verrouille le roman pour les autres utilisateurs pendant 5 minutes.</p>
<!-- ↑ behavior not visible: side effect + invisible constraint -->
```
