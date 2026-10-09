---
paths:
  - "src/contracts/*.js"
  - "src/services/*/*-service.js"
  - "src/services/services-init.js"
---
# Service Contract

Every Vuemann service registered under a name in `VUEMANN_CONTRACTS` (`src/services/services-init.js`) MUST have a JSDoc-only contract and annotate its implementation with it. `tsc` checks the shape; `servicesInit` checks the annotation at boot.

## Required artifacts

1. MUST create `src/contracts/<service>-contract.js`: `@typedef` only, no runtime data, ends with `export {}`.
2. MUST annotate the exported service object in `src/services/<service>/<service>-service.js`.

```js
/**
 * @typedef {Object} FormService
 * @property {(inputName: string) => string | undefined} getError
 */
export {}
```

```js
/** @type {import('@brugmann/vuemann/src/contracts/form-contract.js').FormService} */
export const formService = { getError }
```

## Annotation style

The runtime regex requires a single-line `@type` block immediately followed by `export const`, referencing the `<service>-contract.js` of the same service. A violation throws at boot with `missing @type annotation referencing <service>-contract.js`.

```js
// GOOD
/** @type {import('@brugmann/vuemann/src/contracts/log-contract.js').LogService} */
export const logService = { error }

// BAD
/**
 * Log service.
 * @type {import('@brugmann/vuemann/src/contracts/log-contract.js').LogService}
 */
export const logService = { error }

// BAD
/** @type {import('@brugmann/vuemann/src/contracts/log-contract.js').LogService} */
const helper = () => {}
export const logService = { error }

// BAD
/** @type {import('@brugmann/vuemann/src/contracts/tabs-contract.js').TabsService} */
export const logService = { error }
```

The three BAD cases are, in order: a description in the same block as `@type`; code between the annotation and the `export`; the contract of another service.

## Runtime check

`servicesInitInternal.checkContractAnnotation(serviceName, service)` runs for each registered name present in `VUEMANN_CONTRACTS`. It reads `/src/services/<folder ?? serviceName>/<serviceName>-service.js`.

| Case | Result |
|---|---|
| Annotation present | Pass |
| File found, annotation missing | Throws (path + contract name) |
| File absent, `vuemann: true` | Silent skip |
| File absent, no `vuemann` | Throws; declare `folder` |
| Name not in `VUEMANN_CONTRACTS` | No check (custom service) |

Adding a Vuemann contract: create `<name>-contract.js` AND add the name to `VUEMANN_CONTRACTS`.

## Init markers

Optional keys of a `*-init.js`, alphabetical order: `dependencies, folder, plugin, routes, services, setup, store, vuemann`.

| Key | Meaning |
|---|---|
| `vuemann: true` | Native Vuemann service. A child app MUST NOT set it. |
| `folder` | Implementation lives in `src/services/<folder>/` instead of `src/services/<service>/`. Required only for a non-conventional directory. |

## Child apps

A child app overriding a Vuemann service MUST register under the contract name, annotate with `@brugmann/vuemann/src/contracts/<service>-contract.js`, and MUST NOT set `vuemann: true`. A custom service named outside `VUEMANN_CONTRACTS` needs no annotation. SHOULD enable `checkJs` and run `tsc` in CI for full shape enforcement.

## Authoring

- MUST NOT import Vue, hold logic or hold runtime data in a contract file.
- PREFER `Record<string, unknown>` over `Object`, `unknown` over `*`; import external types (`import('vue-router').RouteLocationRaw`).
- PREFER broadening a union return (`string | string[] | undefined`) over narrowing: narrowing in Vuemann hides data from child apps.
