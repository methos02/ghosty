# Mise à jour Vuemann — Todo List

**Source nouvelle version** : `C:\Users\metho\Documents\NAS\Projets\Vuemann`
**Cible** : `c:\wamp64\www\ghosty\vuemann\`
**Date** : 2026-04-18

---

## ⚠️ Points d'attention critiques

- **NE PAS écraser** `services/auth/` custom Ghosty avec la version Vuemann (auth custom JWT + dialogs)
- **Services exclus définitivement** (NE PAS importer) : `websocket/`, `auth-keycloak/`
- **Service opt-out à arbitrer** : `log/`
- **Conserver** `form.addErrors` et `mapFields` ajoutés côté Ghosty
- **Travailler dans un worktree** (règle CLAUDE.md — pas de dev direct sur `master`)

---

## 0. Préparation

- [ ] Préparer un worktree git dédié à la mise à jour Vuemann (branche `feature/vuemann-update`)
- [ ] Comparer les `package.json` / dépendances entre l'ancienne et la nouvelle version de Vuemann

---

## 1. Fichiers racine et helpers

- [ ] Mettre à jour les fichiers racine de Vuemann (`App.vue`, `main.js`, `vuemann-vite.js`)
- [ ] Mettre à jour les helpers existants (`date-helper`, `utils-helper`, `word-helper`)
- [ ] Ajouter les nouveaux helpers : `locale-helper.js`, `location-helper.js`, `toc-helper.js`

---

## 2. Services partagés et services Vuemann

- [ ] Mettre à jour `services-helper.js`, `services-manager.js` et `services-routes.js`
- [ ] **Service ajax** : mettre à jour constants/init/helpers/models et **supprimer** `ajax-plugin.js` obsolète
- [ ] **Service form** : mettre à jour + ajouter `inami-test.js`, `CalendarPopupComponent.vue`, `use-keyboard-navigation.js`
- [ ] Vérifier que `form.addErrors` et `mapFields` (custom Ghosty) sont conservés ou réintégrés
- [ ] **Service flash** : mettre à jour init, functions, store, `FlashComponent`
- [ ] **Service locale** : mettre à jour + ajouter le nouveau `locale-store.js`
- [ ] **Service router** : ⚠️ breaking change — remplacer `RouterComponent.vue` par `LinkComponent.vue` + `ViewComponent.vue`, mettre à jour functions/store/locales
- [ ] **Service utils** : mettre à jour constants, plugin, store, hydrate, `AppComponent`, `DebugBar`, `ErrorComponent`
- [ ] **Service auth** : mettre à jour Vuemann SANS écraser l'auth custom Ghosty
- [ ] **Service websocket** : ❌ NON IMPORTÉ — ne pas mettre à jour, conserver l'exclusion
- [ ] **Service auth-keycloak** : ❌ NON IMPORTÉ — ne pas mettre à jour, conserver l'exclusion
- [ ] **DÉCISION** : exclure ou intégrer le nouveau service `log/` (opt-out par défaut)

---

## 3. Composants

- [ ] Mettre à jour les composants existants :
  - `ConfirmButtonComponent`, `DialogComponent`, `HeaderComponent`, `LoaderComponent`, `PaginatorComponent`
  - `breadcrumb/`, `changelog/`, `paginators/`, `deprecated/`
- [ ] Ajouter les nouveaux composants :
  - `DelayedLoaderComponent.vue`
  - `DocumentationComponent.vue`
  - `SkeletonLoader.vue`
  - `TableOfContentsComponent.vue`
  - `stepper/StepperComponent.vue` (+ `stepper.scss`, `use-stepper-keyboard-navigation.js`)
  - `tabs/TabsComponent.vue` + `TabItemComponent.vue` (+ `tabs.scss`)

---

## 4. Styles SCSS

- [ ] Mettre à jour les SCSS layout :
  - `_variables.scss`, `_badges.scss`, `_buttons.scss`, `_colors.scss`, `_form.scss`
  - `_global.scss`, `_reset.scss`, `_root.scss`, `_table.scss`
  - `inputs/_input.scss`, `inputs/_input-search.scss`
- [ ] Mettre à jour `librairies/_fontawesome.scss` et `vuemann.scss`

---

## 5. Locales

- [ ] Mettre à jour les locales globales :
  - `components/header/header-component.json` (en/fr/nl)
  - `dev-en.json`, `dev-fr.json`, `dev-nl.json`
- [ ] Ajouter les nouvelles locales :
  - `components/stepper/stepper-component.json` (en/fr/nl)
  - `services/router/src/router-functions-{lang}.json` (en/fr/nl)

---

## 6. APIs

- [ ] Mettre à jour l'API `users` (DTO, locales en/fr/nl, `UserSearchComponent`)
- [ ] **DÉCISION** : intégrer ou non la nouvelle API `beid` (BeidCardReader)

---

## 7. Configuration

- [ ] Mettre à jour la config : `app-config.js`, `config-loader.js`, `route-config.js`, `routes-api-config.js`
- [ ] Ajouter la nouvelle config `documentations/` :
  - `general.js`
  - `pages/auth.js`
  - `pages/auth-keycloak.js`

---

## 8. Vues de démo

- [ ] Mettre à jour les vues de démo Vuemann :
  - `ApiPage`, `ChangelogPage`, `ComponentsPage`, `HelpersPage`, `HomePage`, `ServicesPage`
  - Pages dans `componentsPage/` et `configPage/`
- [ ] **Supprimer** les vues obsolètes : `CommandsPage.vue`, `commandsPage/InitApiPage.vue`
- [ ] Ajouter les nouvelles vues :
  - `ConventionsPage.vue`
  - `Documentation/AuthDocumentPage.vue`
  - `Documentation/ComponentsDocumentPage.vue`
  - `Documentation/HomeDocumentPage.vue`
  - `apiPage/BeidCardReaderPage.vue` (si beid intégré)
  - `componentsPage/DelayedLoaderPage.vue`
  - `componentsPage/SkeletonLoaderPage.vue`
  - `componentsPage/StepperPage.vue`
  - `componentsPage/TabsPage.vue`

---

## 9. Intégration côté frontend Ghosty

- [ ] Adapter le frontend Ghosty aux breaking changes :
  - Imports `@brugmann/vuemann/*` éventuellement renommés
  - Signatures de fonctions modifiées
  - Composants renommés (notamment `RouterComponent` → `LinkComponent` / `ViewComponent`)
  - `vuemann-vite.js` si l'API change
- [ ] Lancer `npm run dev` sur le frontend Ghosty et vérifier qu'il démarre sans erreur
- [ ] Tester manuellement les flux clés (login custom, listing romans, navigation) et corriger les régressions

---

## 10. Finalisation

- [ ] Mettre à jour les memories Vuemann si l'API/architecture change (`vuemann_architecture`, `vuemann_services_opt_out`, etc.)
- [ ] Commit + merge du worktree dans `master`, puis suppression du worktree

---

## Récapitulatif des nouveautés majeures

### Nouveaux fichiers (additions)
| Type | Élément |
|------|---------|
| Helper | `locale-helper.js`, `location-helper.js`, `toc-helper.js` |
| Composant | `DelayedLoader`, `Documentation`, `SkeletonLoader`, `TableOfContents` |
| Composant | `stepper/` (StepperComponent + scss + keyboard-nav) |
| Composant | `tabs/` (TabsComponent + TabItemComponent + scss) |
| Service | ~~`auth-keycloak/`~~ ❌ NON IMPORTÉ |
| Service | ~~`websocket/` mises à jour~~ ❌ NON IMPORTÉ |
| Service | `log/` enrichi (routes, dto, function, test, LogTestComponent) — opt-out à confirmer |
| Service | `router/` : `LinkComponent` + `ViewComponent` |
| Service | `form/` : `inami-test`, `CalendarPopupComponent`, `use-keyboard-navigation` |
| Service | `locale/src/locale-store.js` |
| Service | `auth/src/auth-helpers.js` + images login/logout |
| API | `beid/` (BeidCardReader, opt-in à confirmer) |
| Vues | `ConventionsPage`, `Documentation/*`, `Beid`, `DelayedLoader`, `Skeleton`, `Stepper`, `Tabs` |
| Config | `documentations/` (general, auth, auth-keycloak) |

### Fichiers supprimés (only in old)
- `services/ajax/init/ajax-plugin.js`
- `services/router/views/RouterComponent.vue` (remplacé)
- `views/CommandsPage.vue`
- `views/commandsPage/InitApiPage.vue`
