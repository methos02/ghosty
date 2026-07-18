# Utils Service

`import { utils } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

**Dependencies:** ajax, router

## Methods

- `utils.apiStatus()` — checks all APIs by fetching `openapi.json` in parallel (5s timeout). Pushes translated error keys to `errorsGlobal`, logs failing APIs to console, sets `appStatus` in store, and returns `{ appStatus: APP_STATUS.LOADED | APP_STATUS.ERROR }`. Designed to be used as `AppComponent.cb`.
- `utils.isDeprecated(message)` — console warning for deprecated features
- `utils.needUpdate(version)` — async, compares with server app.json, returns boolean

## hydrate(data, keys, config?)

Replaces reference objects (`{ id: 1 }`) with full entities from controllers.

`import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'`

**Per-key config:** `controller` (string, default: key name), `method` (string, default: 'byIds'), `filter` ((item) => boolean — true to include), `entityKey` (string, default: 'id' — dot-notation path for entity matching key)

```javascript
await HydrateFunctions.hydrate(data, ['reader', 'service'])
// With config:
await HydrateFunctions.hydrate(data, ['author'], { author: { controller: 'author', method: 'getByIdsWithDetails', filter: (s) => s.status === 'scheduled' } })
// With custom entity key (when entity doesn't use top-level id):
await HydrateFunctions.hydrate(data, ['user'], { user: { controller: 'refidUser', entityKey: 'identifiers.samAccountName' } })
```

## registerController(name, controller)

Register controllers for hydrate. Call at startup before `initServices`.

```javascript
utils.registerController('reader', ReaderController)
```

## AppComponent

Root component managing app state: `INIT`, `LOADING`, `LOADED`, `ERROR`, `ERROR_AUTH`.

`import AppComponent from '@brugmann/vuemann/src/services/utils/views/AppComponent.vue'`

**Props:** `cb` (Function — async, returns `{ appStatus, error? }`)

States: `LOADED` → router, `INIT` → loader, `LOADING` → hidden router (view manages loader), `ERROR` → error + retry, `ERROR_AUTH` → silent wait.

Public pages (`login`, `changelog`) accessible during `ERROR_AUTH`. Auto re-executes cb after `login-success` event (dispatched by `LoginComponent` after redirect).

Custom loading message: `utilsStore.setLoadingSentence('translation.key')`

## DebugBar

Auto-displays: version, update alert, changelog link (if route exists).
