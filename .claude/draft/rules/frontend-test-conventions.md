# Learn Report: Conventions de tests frontend, erreur de formulaire, seeders

- **Feature / context** : mise en place de la suite de tests frontend (Vitest / @vue/test-utils) — DTOs, controllers, stores, composables, services, composants Vue — avec de nombreuses corrections de style et de structure de l'utilisateur.

## Proposal 1: Inliner `mount()` dans chaque test — pas de factory `mountXxx`
- **Target**: front
- **Problem encountered**: j'avais créé des factories locales `mountLoader`/`mountDialog`/`mountDropdown`/`mountPaginator`/`mountRange`/`mountSearchBar` (`const mountX = (props) => mount(Component, {...})`) réutilisées par les `it`. L'utilisateur les a toutes fait supprimer et a inliné `mount(Component, { props, slots })` dans chaque test.
- **Origin remark**: « je préfère du local, ça doit être simple et lisible pas de regroupement » ; puis modification directe de `LoaderComponent.test.js` + ajout mémoire : « Pas de factory de montage du tout : inliner mount(...) dans CHAQUE test … l'appel mount(Component, { props, slots }) doit être écrit directement dans chaque it, sous les yeux. Assumer la répétition entre tests. »
- **Suggested convention**: interdire les factories de montage (`const mountXxx = ...`) et tout helper local qui regroupe une **séquence d'actions** de test (ex. `fillCredentials` remplissant des inputs). Écrire `mount(...)` et les actions directement dans chaque `it`. La répétition entre tests est assumée. Nuance importante : un helper **partagé de format de données** reste autorisé et encouragé (ex. `controllerSuccess`/`controllerError` dans `tests/utils/helpers/`), ainsi que les **mocks** en fichiers dédiés (`tests/utils/mocks/`). La distinction : helper OK pour un *format de données*, pas pour des *étapes de test* ni le *montage*.
- **Suggested scope**: `frontend/**/*.test.js` (surtout tests de composants).
- **Category hint**: rule

## Proposal 2: Pas de constante intermédiaire pour une valeur simple à usage unique
- **Target**: front
- **Problem encountered**: des tests (portés de vuemann) déclaraient `const inputDate = ...; const format = ...; const expected = ...` puis `expect(fn(inputDate, format)).toBe(expected)`. L'utilisateur a inliné les littéraux dans l'`expect`.
- **Origin remark**: « pas besoin de constante ça nuit à la lisibilité j'ai fait un refactoring » (sur `date-helper.test.js`).
- **Suggested convention**: pour une valeur simple utilisée une seule fois, l'inliner directement dans l'`expect` (`expect(dateHelper.formatDate('2025-04-27', 'DD/MM/YYYY')).toBe('27/04/2025')`) plutôt que de la nommer. Garder une variable uniquement si elle est réutilisée (ex. un `result` asserté sur plusieurs propriétés).
- **Suggested scope**: `frontend/**/*.test.js`.
- **Category hint**: rule

## Proposal 3: Objet `failure`/passthrough défini localement dans le test
- **Target**: front
- **Problem encountered**: j'avais un `const failure = controllerError()` au niveau module, partagé par plusieurs tests qui l'utilisaient à la fois comme retour de mock ET comme valeur attendue (`.toBe(failure)`). L'utilisateur a demandé de le mettre en local.
- **Origin remark**: « pourquoi ce failure ? » puis « je préfère au niveau locale ».
- **Suggested convention**: un objet utilisé pour vérifier un passthrough par identité de référence (`expect(x).toBe(failure)`) doit être défini **localement dans le test** (`const failure = controllerError()` dans l'`it`), pas au niveau module. Rend visible la relation entrée = sortie et évite l'état partagé implicite.
- **Suggested scope**: `frontend/**/*.test.js`.
- **Category hint**: rule

## Proposal 4: Noms de variables parlants — pas de variable d'une seule lettre
- **Target**: front
- **Problem encountered**: j'avais `const a = useStore(); const b = useStore()` et une variable `store` pour `formStore`. L'utilisateur a renommé en `storeA`/`storeB` et `formStore`.
- **Origin remark**: « je ne veux pas de lettre A tout seul, je viens de le changer » ; « appelle le formStore, pas juste store c'est plus clair ».
- **Suggested convention**: interdire les identifiants d'une seule lettre ; utiliser des noms parlants qui reflètent la chose (`formStore` plutôt que `store`, `storeA`/`storeB` plutôt que `a`/`b`). Portée générale (langage), pas seulement les tests.
- **Suggested scope**: `frontend/**/*.{js,vue}`.
- **Category hint**: rule

## Proposal 5: Description de test = énoncer POURQUOI
- **Target**: front
- **Problem encountered**: un test nommé « does not call auth.login when the form is invalid » testait en réalité une soumission **vide**. L'utilisateur a corrigé en « empty », et a demandé qu'un test de format invalide dise explicitement la cause (email).
- **Origin remark**: « j'ai changé le description, c'est pas invalide mais empty » ; « il faut dire pourquoi invalide mail en l'occurrence je pense ».
- **Suggested convention**: la description (et l'assertion) d'un test doivent énoncer la **cause précise** du comportement, pas une catégorie vague. Distinguer « empty » (règle `required`) de « invalid email format » (règle `email`), et asserter l'erreur spécifique (`form.getError('email')` = `auth.login_error_email_invalid`) plutôt qu'un `hasError()` générique quand la raison est le sujet du test.
- **Suggested scope**: `frontend/**/*.test.js`.
- **Category hint**: rule

## Proposal 6: Erreur de formulaire non liée à un input = `form.addError` + `ErrorFormComponent`, pas un « global error » dans utils
- **Target**: front
- **Problem encountered**: pour un échec de login (identifiants invalides / 401), j'avais d'abord proposé une erreur globale via un mécanisme `utils.addGlobalError`. L'utilisateur a rejeté ce concept (mélange de concepts ; `errorsGlobal` de utils est une page `/error` app-level, non visible dans un dialog) et a défini l'approche correcte.
- **Origin remark**: « addGlobalError devrait être dans form, c'est une erreur qui n'est pas rattaché à un input mais peut impliquer deux ou trois input … il faut retiré global error de utils et simplement mettre un ErrorComponent avec le name login.unauthorize et alors fait un form.add ».
- **Suggested convention**: une erreur qui n'appartient pas à un champ précis mais au **formulaire** (peut concerner plusieurs inputs) se modélise comme une erreur de formulaire : `form.addError('<form>.<name>', '<clé de traduction>')` sous un nom logique (ex. `login.unauthorize`), affichée par un `<ErrorFormComponent name="<form>.<name>" />` autonome placé dans le formulaire. Ne PAS créer de mécanisme d'« erreur globale » dans le service utils pour ce cas (`errorsGlobal`/`ErrorComponent` = erreurs fatales app-level sur la route `/error`, distinct).
- **Suggested scope**: `frontend/src/**/*.vue` (formulaires, dialogs auth), `frontend/src/services/form/**`.
- **Category hint**: decision

## Proposal 7: Seeders à double forme — `getXxxApi` (forme API) + `getXxx` (view model via le vrai DTO)
- **Target**: front
- **Problem encountered**: les seeders ne fournissaient que la forme API (`getNovelApi`). L'utilisateur a enrichi `novel-seeder.js` pour exposer aussi la forme **view model** dérivée du vrai DTO (`getNovel = () => NovelDto.fromShow(getNovelApi())`, `getNovels = () => NovelDto.fromList(getNovelsApi())`).
- **Origin remark**: refactoring direct de `tests/utils/seeders/novel-seeder.js` important le vrai `NovelDto` et exposant `getNovel`/`getNovels` en plus de `getNovelApi`/`getNovelsApi`.
- **Suggested convention**: un seeder de domaine expose deux formes cohérentes construites l'une à partir de l'autre via le **vrai DTO** : `getXxxApi()` (forme brute API, snake_case) pour tester les repositories/controllers, et `getXxx()` = `XxxDto.fromShow(getXxxApi())` (view model camelCase) pour tester composables/composants. Garantit que les données de test suivent la vraie transformation DTO. Affine `no-hardcoded-data-but-seeders-instead`.
- **Suggested scope**: `frontend/tests/utils/seeders/*.js`.
- **Category hint**: rule
