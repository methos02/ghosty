---
paths:
  - "src/views/Documentation/**/*DocumentPage.vue"
  - "src/config/documentations/pages/*.js"
---
# Documentation Page

User docs explain what is **not** visible on screen. MUST NOT paraphrase the UI.

## Content

MUST NOT write what an element does when its label already says it (« Publier » publishes, « Annuler » cancels, « Charger plus » loads more results), nor describe visible badges, labels, dates. The screenshot and its legend are enough.

Document only what the user cannot guess:
- side effects (other screens updated, notification sent);
- real-time / multi-user propagation;
- invisible constraints (character limit, required field, expected format);
- multi-screen interactions (where it lands, what it triggers in cascade);
- trace in the history.

Test before writing a paragraph: *does this sentence teach something that is not already on the screenshot?* If not, delete it.

## Markers

A marker text is **one short sentence** identifying the element (« Bouton pour publier le chapitre. »). Any detail belongs to a dedicated paragraph of the section, not to the legend.

- A marker matching a developed section wraps its sentence in a link: `<a href="#section-id" class="link-underline color-primary pointer">…</a>`.
- `markers: []` is valid when the intro and the screenshot are enough.
- MUST NOT mark: universal buttons (Cancel, Close, Back); constraints already visible in the field (placeholder « 150 caractères max », required `*`); behaviours obvious from the interaction; implementation details (lazy loading, cache, internal pagination).

```js
// BAD
markers: [
  { number: 1, selector: '#button-cancel', description: "Ferme le formulaire sans enregistrer." },
  { number: 2, selector: '[name="title"]', description: "Champ obligatoire, 150 caractères max." },
]

// GOOD
markers: [
  { number: 1, selector: '#button-publish', description: "Bouton pour publier le chapitre." },
]
```

## Structure

- `DocumentationComponent` injects the table of contents immediately before the first `.h2`. The first `<h2>` MUST follow the intro paragraph directly; an overview figure goes under an h2 (« Vue d'ensemble »).
- A sub-screen reachable only from a parent dialog is merged into the parent page as `<h3>` sections (`parentPage` in the page config). A separate page is justified only when the sub-screen has its own route.
- When consolidating, remove the orphan Vue page, its file in `src/config/documentations/pages/`, its entry in `src/config/documentations/index.js` and its route in `src/config/routes-config.js`.

```vue
<!-- BAD -->
<h1>Écrire un chapitre</h1>
<p>Intro…</p>
<figure><img /></figure>
<h2 class="h2" id="actions">Actions</h2>
<p>Le bouton « Publier » permet de publier le chapitre.</p>

<!-- GOOD -->
<h1>Écrire un chapitre</h1>
<p>Intro…</p>
<h2 class="h2" id="vue-d-ensemble">Vue d'ensemble</h2>
<figure><img /></figure>
<h2 class="h2" id="publier">Publier</h2>
<p>La publication notifie l'auteur du chapitre parent et rend le chapitre non réécrivable.</p>
```
