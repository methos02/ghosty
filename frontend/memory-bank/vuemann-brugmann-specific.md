# Vuemann — Brugmann-specific content (to strip on every sync)

The `vuemann/` folder is the framework "reservoir", mirrored from the NAS source
`C:\Users\metho\Documents\NAS\Projets\vuemann-main`. That source is built for **CHU Brugmann
hospital** and ships institution-specific content that Ghosty (a novels platform) must not keep.

**Every time `vuemann/` is re-synced from the NAS reservoir, re-remove the items below.**
Ghosty imports only what it needs from `vuemann/`, so these are never imported at runtime — but we
strip them to keep the dependency clean and dependency-free (e.g. no `keycloak-js`).

## Removed (2026-07-18)

| Item | Path in `vuemann/src` | Why Brugmann-specific |
|------|-----------------------|-----------------------|
| APIs | `apis/` (`beid/`, `users/`) | `beid` = Belgian eID card reader; `users` = hospital user directory (INAMI, etc.) |
| Images | `assets/images/brugmann-logo_white.svg`, `brugmann-logo_white-xs.png` | CHU Brugmann branding |
| Auth (standard) | `services/auth/` | Brugmann's own auth flow. Ghosty has its **own custom auth** (JWT + dialogs) in `frontend/src/services/auth/`. |
| Auth Keycloak | `services/auth-keycloak/` | Brugmann Keycloak SSO; also pulls the `keycloak-js` dependency |
| Proxy | `helpers/proxy-helper.js`, `core-vite/proxy-middleware.js` | Brugmann-specific dev proxy (`isChuBrugmannHost` → `chu-brugmann.be`, private-IP hosts, `/proxy/...` URL rewriting). **Edit:** `services/ajax/src/ajax-functions.js` had its proxy import + `applyProxy` removed (proxy was config-gated OFF by default, so `defineApiUrl` now returns the plain url); `vuemann-vite.js` had the `configureServer`/proxy middleware removed. |

**Both auth services are Brugmann-dedicated** — Ghosty never uses vuemann auth. Removing `services/auth/` is
safe: `shortcuts/auth-shortcut.js` (and the `services-shortcut.js` barrel) resolve auth **via the service
manager at runtime**, with no hard import of `services/auth/`. In Phase B, Ghosty registers its own auth
service into the manager so `auth.*` shortcuts point at the custom auth. Only Brugmann demo files
(`main.js`, `views/servicesPage/AuthPage.vue`, `config/documentations/pages/auth.js`, …) referenced the
removed service, and Ghosty never imports those.

## Trimmed for Ghosty (2026-07-18) — not Brugmann-specific, just unneeded

Cut from `vuemann/src` to keep the reservoir lean for Ghosty. Re-apply on every re-sync.

| Item | Path | Reason |
|------|------|--------|
| Changelog component | `components/changelog/` | Vuemann-internal version changelog UI; no use in Ghosty |
| Header components | `components/HeaderComponent.vue`, `components/header/` | Ghosty builds its own header/layout |
| Deprecated components | `components/deprecated/` | Old paginators kept for back-compat upstream |
| Extra paginators | `components/paginators/PaginatorLoadMoreComponent.vue`, `PaginatorRangeComponent.vue` | Ghosty keeps only **classic** + **infinite**. `components/PaginatorComponent.vue` was edited to import/render only those two (dropped the `deprecated` wrapper too). |
| Demo/doc views | `src/views/` → **moved out** to repo-root `vuemann-demo/` | The whole `views/` tree is vuemann's demo/documentation app. Extracted out of `vuemann/` (kept as reference). |
| CodeHtml component | `components/codeHtml/` | Only used by the demo views (and `config/route-config.js` demo routing). |
| Documentation component | `components/DocumentationComponent.vue` | Doc/demo-only; no importers left after views moved out. |
| Table of contents | `components/TableOfContentsComponent.vue`, `helpers/table-of-contents-helper.js` | Documentation-only; no meaning for a novels site. |
| Demo config | `config/app-config.js`, `config/auth-config.js`, `config/route-config.js`, `config/routes-api-config.js`, `config/documentations/` | Demo/Brugmann config (fake API URLs, Brugmann roles, demo routes importing the moved views, doc pages). Ghosty provides its own config in `frontend/src/config/`. |
| Locale defaults | `config/locale-config.js` | Default locale list (fr/nl/en) is app-specific — Ghosty provides its own `locales` via `ConfigLoader.init`. **Edits made** to keep vuemann coherent: `config/config-loader.js` now starts `configUser = {}` (no import); `services/locale/views/LocaleComponent.vue` reads `ConfigLoader.find('locales', {})`. Dangling: `services/locale/src/locale-vite.js` still imports it (build-time plugin, unused by Ghosty which has its own locale-vite). **Kept core in `config/`:** `config-loader.js` only. |

| Demo bootstrap | `src/App.vue`, `src/main.js` → **moved out** to `vuemann-demo/` | vuemann's standalone demo shell/entry (App.vue imports the removed HeaderComponent; main.js imports the removed demo configs). Ghosty has its own `frontend/src/App.vue` + `main.js`. |
| Orphaned locales | `locales/{en,fr,nl}/apis/` (users), `.../components/{changelog,header,codeHtml}/` | Locale files for the removed components/apis. Kept: breadcrumb, confirm-button, dialog, paginators, stepper, helpers, services/form, services/router. |

Verified **clean / kept as-is** (generic framework, nothing Brugmann/demo): `constants/`, `contracts/`,
`shortcuts/`, `types/`, `helpers/`, `assets/scss/`. No references to keycloak/beid/users remain anywhere.

**Breadcrumb was KEPT** (`components/breadcrumb/`) — plausibly useful for Ghosty's Novel › Chapter › Proposition hierarchy.

## Candidates — not yet removed (review)

Removing these needs a code edit or only affects unused Brugmann **demo** files, so left in place for now:

| Item | Path | Note |
|------|------|------|
| Belgian form validators | `services/form/src/defaultTests/inami-test.js`, `belgian-number-test.js` | Registered (`niss`/`biss`/`inami`/`passport`) in `services/form/src/default-tests-form.js`; removing requires editing that file (which the form service **does** use). Harmless dead validators otherwise. |
| Keycloak doc config | `config/documentations/pages/auth-keycloak.js` | Brugmann doc page; only referenced by demo config. |
| App-info build tool | `core-vite/app-info.js` | Generates `app.json` build metadata; unused by Ghosty. `vuemann-vite.js` had its `appInfo.generateAppInfo()` call removed. |
| Auth contract | `contracts/auth-contract.js` | Contract for the (removed) auth service — no matching service exists. Other contracts kept (their services exist). |
| Docker | `vuemann/Dockerfile`, `vuemann/docker-compose.yml` | Brugmann/vuemann container setup; irrelevant to Ghosty. |
| Build tooling (rest) | `vuemann-vite.js`, `core-vite/` (image-copier, config-extractor, translations) | vuemann's remaining package/demo build plugins. Ghosty uses its own `frontend/vite.config.js` + `frontend/src/services/locale/init/locale-vite.js`, so unused by Ghosty. Candidate to move to `vuemann-demo/` or drop — left for now. |

## Memory-bank cleanup (2026-07-18)

`frontend/memory-bank/` was replaced with vuemann's (much richer), then pruned of Brugmann-ecosystem /
vuemann-internal / removed-feature content:

**Removed:**
- `README.md` (CHU Brugmann library + private `@brugmann` registry)
- `changelog/`, `changelog-template/` (vuemann version history), `scripts/` (Brugmann DOM anonymization + e2e)
- `decisions/` (vuemann-internal ADRs — were absent/not carried over)
- Doc for removed features: `doc/api/`, `doc/services/{auth,auth-keycloak}.md`, `doc/components/{changelog,header,code-html,table-of-contents,input-search-entity-picker}.md`, `doc/helpers/{proxy-helper,table-of-contents-helper}.md`
- Agents (Brugmann anonymization + the removed doc-generation pipeline): `anonymization-verifier`, `data-anonymizer`, `playwright-runner`, `doc-writer`, `doc-code-analyzer`, `doc-verifier`
- Commands (GitLab / vuemann-internal / doc-gen): `issue-create`, `issue-close`, `issue-treate`, `upgrade-vuemann`, `sync-claude`, `init-project`, `generate-doc`, `correct-doc`
- Trimmed the Brugmann **proxy section** (Caddy / `chu-brugmann.be` / SSRF) out of `doc/services/ajax.md`.

**Kept:** `rules/` (74 — coding conventions, the core value), `doc/` (components/css/config/helpers/services for kept features + `templates/`), and `vuemann-brugmann-specific.md`.

**Kept + adapted to GitHub/Ghosty (2026-07-18):** the dev workflow the user likes (issue creation, plan
application, tests, rules). `agents/` (5: code-quality-checker, test-creator-updater, test-quality-checker,
plan-applier, rule-optimizer) + `commands/` (8: apply-plan, apply-rule, correct-test, learn, optimize-rule,
**issue-create, issue-close, issue-treate** — the issue commands were restored). Adaptations applied:
`glab` → `gh` (GitLab CLI → GitHub CLI, correct `gh issue`/`gh pr` syntax), "GitLab"/"MR" → "GitHub"/"PR",
default branch `main` → **`master`** (Ghosty's default). Vuemann-context auto-detection kept (auto-skips in Ghosty).

**Domain examples rewritten (2026-07-18):** all Brugmann-domain examples across the memory-bank
(rules, docs, commands) were replaced with the Ghosty domain. Two domains cleaned:
- Hospital: Hospitalization→Novel, Intervention→Chapter, Surgery→Proposition, Patient→Reader,
  Practitioner/Opera→Author, Speciality→Genre, Operation→Work, BoxOccupation→Novel.
- IRIS Academy / certification: organisation_unit→Genre, team→Novel, certification→publication,
  iris_academy→ghosty.
GUMS/keycloak/auth-keycloak example references genericized. Verified: zero Brugmann-domain terms remain (full sweep clean).

**Intentionally kept:** `doc/services/form.md` documents the `niss`/`inami` Belgian validators — those
validators still exist in `vuemann/src/services/form/src/defaultTests/` (listed as candidates, not removed).

## Reference

- Reservoir (source of truth): `C:\Users\metho\Documents\NAS\Projets\vuemann-main`
- Import alias in Ghosty: `@brugmann/vuemann/src` → `../vuemann/src` (in `frontend/vite.config.js`)
