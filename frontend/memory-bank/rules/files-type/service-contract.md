---
paths:
  - "src/contracts/*.js"
  - "src/services/*/*-service.js"
---
# Vuemann Service Contract Rules

Every vuemann service registered through `servicesM.register` must respect a contract enforced statically by `tsc` via JSDoc.

## Required artifacts per service

1. **Contract file** at `src/contracts/<service>-contract.js`. JSDoc-only — no runtime data:

   ```js
   /**
    * @typedef {Object} FormService
    * @property {(inputName: string) => string | undefined} getError
    */
   export {}
   ```

2. **`init/<service>-service.js`** must annotate the exported service object with the matching `@type`:

   ```js
   /** @type {import('../../contracts/form-contract.js').FormService} */
   export const formService = { ... }
   ```

   Without this annotation, `tsc` cannot link the impl to the contract — drift becomes invisible. `services-init.js` checks per-service at boot and **throws if the annotation is missing**.

### Annotation style — single-line, immediately above `export const`

The runtime regex requires the annotation to be **single-line** and **immediately followed by the `export const`** (whitespace only between the closing `*/` and `export`). No description allowed inside the same JSDoc block.

```js
// ✓ OK — single-line, attached
/** @type {import('../../contracts/auth-contract.js').AuthService} */
export const authService = { ... }

// ✓ OK — description in a separate JSDoc above
/**
 * Auth service implementation.
 */
/** @type {import('../../contracts/auth-contract.js').AuthService} */
export const authService = { ... }

// ✗ KO — description in the same block as @type
/**
 * Auth service implementation.
 * @type {import('../../contracts/auth-contract.js').AuthService}
 */
export const authService = { ... }

// ✗ KO — annotation orphaned by code between */ and export
/** @type {import('../../contracts/auth-contract.js').AuthService} */
const helper = () => {}
export const authService = { ... }

// ✗ KO — annotation references a different contract than the service name
/** @type {import('../../contracts/log-contract.js').LogService} */
export const authService = { ... }   // file is auth-service.js, must reference auth-contract.js
```

Each violation throws at boot with `missing @type annotation referencing <serviceName>-contract.js`.

## How the runtime check is wired

The check is **driven by the registration name**, not by an explicit marker. `services-init.js` ships a hardcoded set, exposed via `servicesInitInternal` for testability:

```js
const VUEMANN_CONTRACTS = new Set([
  'ajax', 'auth', 'form', 'locale', 'log', 'router', 'tabs', 'utils', 'websocket',
])
```

If a service is registered under one of these names, the boot enforces the contract on its impl file. If the name is unknown (custom service), no check runs.

> Adding a new vuemann contract = (1) create `<name>-contract.js` under `src/contracts/` AND (2) add the name to `VUEMANN_CONTRACTS`. A drift test (`services-init.vuemannContracts.test.js`) compares the Set against the directory contents and fails CI if they diverge.

## Init file markers

`*-init.js` files declare two contract-related keys (both optional):

| Key | Type | Meaning |
|---|---|---|
| `vuemann` | `true` | Native vuemann service — skip silently if impl file is absent in the consuming project |
| `folder` | `string` | Override lookup folder: impl is at `/src/services/<folder>/<service>-service.js` instead of the conventional `/src/services/<service>/<service>-service.js` |

```js
export const authInit = {
  dependencies: ['ajax'],
  services: authService,
  store: useAuthStore(),
  vuemann: true,
}
```

Keys must be alphabetical: `dependencies, folder, plugin, services, setup, store, vuemann`.

`vuemann: true` is **reserved for vuemann's own init files**. Child apps must never set it.

`folder` is required only when the implementation lives in a non-conventional directory (e.g. `auth-jwt`).

## Enforcement layers

| Layer | What it checks | When |
|---|---|---|
| `tsc` (`npm run typecheck`) | impl matches the `@typedef` (params, returns, missing methods) | CI + IDE live + `npm run dev` |
| `services-init` runtime | `<service>-service.js` for any service registered under a known contract name has the `@type` annotation | App boot, test setup |

Type-shape errors → tsc. Forgotten annotations → runtime check.

## Runtime check behaviour

`services-init.js` calls `checkContractAnnotation(serviceName, service)` for each service whose name is in `VUEMANN_CONTRACTS` (passing the full init object — only `folder` and `vuemann` are read). It resolves the impl path as:

```
/src/services/<folder ?? serviceName>/<serviceName>-service.js
```

| Scenario | Result |
|---|---|
| Name in `VUEMANN_CONTRACTS` + file found + annotation present | Pass |
| Name in `VUEMANN_CONTRACTS` + file found + annotation missing | Throws with path and contract name |
| Name in `VUEMANN_CONTRACTS` + file not found + `vuemann: true` | Silent skip (validated upstream in vuemann CI) |
| Name in `VUEMANN_CONTRACTS` + file not found + no `vuemann` | Throws — guides the developer to declare `folder` |
| Name not in `VUEMANN_CONTRACTS` | No check (custom service, unconstrained) |

## Child apps

Child apps overriding a vuemann service register their init under one of the contract names (e.g. `auth: customAuthInit`). The check fires automatically. They must:

1. Annotate their impl file with:
   ```js
   /** @type {import('@brugmann/vuemann/src/contracts/<service>-contract.js').<Service>Service} */
   ```
2. NOT declare `vuemann: true` (reserved).
3. If the impl lives in a non-conventional folder (not `/src/services/<service>/`), declare `folder: '<folder-name>'` in their init.

Custom child-app services (e.g. `export: exportInit`) named outside `VUEMANN_CONTRACTS` need no annotation and skip the check entirely.

For full type-shape enforcement (param types, return types, missing methods), child apps should also configure `tsc` (`jsconfig.json` with `checkJs: true`) and run `npm run typecheck` in CI.

## Authoring rules

- Contract files are JSDoc-only — no Vue imports, no business logic, no runtime data (`export {}`).
- Use specific types in `@typedef` (e.g. `Record<string, unknown>` over `Object`, `unknown` over `*`).
- Reference external types via `import('vue-router').RouteLocationRaw` etc.
- For union returns, prefer broadening (`string | string[] | undefined`) over narrowing — narrowing in vuemann hides data from child apps.
