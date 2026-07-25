# Learn Report: Localité du setup de test & seeders dérivés du DTO

- **Feature / context**: Portage/écriture de tests frontend (composants + vues novels) — `LoaderComponent.test.js`, `NovelDetailDialog.test.js`, `NovelCard.test.js` — et ajout de formes domaine au `novel-seeder.js`. Les remarques de l'utilisateur ont porté sur la localité du setup dans les tests et sur la structure des seeders.

> Contexte pour le rule-writer : les 3 propositions sont **front** (Vue 3 / Vitest). Elles complètent la règle existante `frontend/memory-bank/rules/tests/no-hardcoded-data-but-seeders-instead.md`, qui interdit déjà les données inline mais **ne couvre pas** les points ci-dessous. Décider fusion vs nouvelle règle.
>
> Note de drift constatée (context, pas une proposition) : la règle seeders existante documente un nommage `{entity}s-seeder.js` (pluriel) + suffixes `Api`/`Data` et un helper `&/utils/mocks/response-mock.js` (`createSuccessResponse`). Le code réel utilise `novel-seeder.js` (singulier), un objet exporté `novelSeeder`, et `&/utils/helpers/controller-response.js` (`controllerSuccess`/`controllerError`). À réconcilier éventuellement lors de l'écriture.

## Proposal 1: Pas de factory de montage — inliner `mount(...)` dans chaque test
- **Target**: front
- **Problem encountered**: Un helper `const mountLoader = (props, slot) => mount(LoaderComponent, {...})` défini en tête de fichier a été refusé. L'utilisateur veut l'appel `mount(...)` écrit directement, visible, dans chaque `it`.
- **Origin remark**: « idem je préfère du local » puis, après clarification, « si, il utilise une helper alors que je voudrais que se soit vraiment en local ». Choix explicite retenu : « Inliner dans chaque test » (vs helper dans le `describe`).
- **Suggested convention**: Interdire toute factory de montage (`mountXxx`), qu'elle soit au niveau module OU dans le `describe`. L'appel `mount(Component, { props, slots })` doit apparaître directement dans chaque `it`. Assumer la répétition entre tests (lisibilité/localité > DRY ici). Ne jamais extraire un tel helper vers un fichier partagé (`tests/utils/test-utils-config.js`). Les **mocks**, eux, restent en fichiers dédiés (`tests/utils/mocks/`) — la règle ne vise que le montage/setup, pas les mocks.
- **Suggested scope**: `tests/**/*.test.js`
- **Category hint**: rule

## Proposal 2: Tout le setup dans chaque `it` — pas de `const` partagé au niveau module
- **Target**: front
- **Problem encountered**: Après avoir remplacé un objet novel inliné par `const novel = novelSeeder.getNovel()` **au niveau module** (partagé par tous les `it`), l'utilisateur a demandé que cette instanciation soit déplacée dans chaque test.
- **Origin remark**: « const novel = novelSeeder.getNovel() doit être dans chaque tests ».
- **Suggested convention**: Aucun état/fixture partagé au niveau module dans un fichier de test. L'instanciation des données de test (appel au seeder : `const novel = novelSeeder.getNovel()`) va **dans chaque `it`**, pas en `const` module-scope ni dans une variable de `describe`. Bénéfices déclarés/observés : setup visible sur place dans le test, et données fraîches par test (pas de fuite d'état entre tests). NB : le **seeder lui-même** reste un util partagé (cf. Proposal 3) — c'est son *appel* qui doit être local. Cohérent avec le principe « vraiment en local » de la Proposal 1 (mount + fixtures = même règle : setup dans le test).
- **Suggested scope**: `tests/**/*.test.js`
- **Category hint**: rule

## Proposal 3: Seeders à deux formes — forme domaine dérivée du vrai DTO (façon Laravel factory)
- **Target**: front
- **Problem encountered**: Le seeder `novel-seeder.js` n'exposait que la forme API (snake_case, `getNovelApi`). Les tests de vues, qui consomment la forme domaine (camelCase, sortie du DTO), inlinaient leur objet novel à la main. Il manquait un pendant « modèle domaine » du seeder.
- **Origin remark**: « il faut un seeder générique un peu comme laravel ».
- **Suggested convention**: Pour chaque entité, le seeder expose **deux formes** :
  - `getXxxApi(overrides)` / `getXxxsApi(count)` : payload API brut (snake_case), tel que renvoyé par le backend.
  - `getXxx(overrides)` / `getXxxs(count)` : forme **domaine** (camelCase), **dérivée du vrai DTO** — `getXxx = (overrides) => ({ ...XxxDto.fromShow(getXxxApi()), ...overrides })`. Avantage : source de vérité unique (`getXxxApi`) + la forme domaine reste automatiquement synchro avec le DTO et teste la vraie transformation (cohérent avec la règle « tester le vrai comportement »). Les tests référencent les champs du seed (`novel.slug`, `novel.title`) plutôt que des littéraux dupliqués dans les assertions.
- **Suggested scope**: `tests/utils/seeders/*.js` (structure des seeders) + `tests/**/*.test.js` (usage : consommer `getXxx()` au lieu d'inliner la forme domaine).
- **Category hint**: rule
