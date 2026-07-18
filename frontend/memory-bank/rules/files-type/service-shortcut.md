---
paths:
  - "src/shortcuts/*.js"
---
# Service Shortcut Rules

Every vuemann service (`src/services/<name>/`) that exposes an API to consume (components, other services) has a `<name>-shortcut.js` in `src/shortcuts/`. `src/shortcuts/services-shortcut.js` is a **pure barrel** that re-exports from the individual files — no logic.

**Pure primitives don't belong here.** Functions with no `servicesM`/`servicesStores` dependency live in `src/helpers/`. A `*-shortcut.js` file is, by definition, a shortcut access to a runtime-managed service.

## Content of a `<name>-shortcut.js`

Three possible exports depending on what the service exposes:

1. **Action shortcut** — wrappers around the service's pure JS actions. If the method lives in the service-manager (action registry), wrap it with `servicesM.service('<name>:method', ...)`. If it lives in the store (Vue refs + methods that mutate those refs), access it directly via `servicesStores.get('<name>')`. The shortcut mirrors the structure of the service, not a perf compromise.
2. **Flattened store shortcut** — getters exposing the refs at top-level + the methods of the registry's nested sub-object. Each getter resolves via `servicesStores.get('<name>')` at call time (no capture at import time).
3. **Composition logic specific to the service** — e.g. `flash.error` composing store + log.

```js
// GOOD — src/shortcuts/flash-shortcut.js
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { servicesStores } from '@brugmann/vuemann/src/services/services-stores.js'

const _store = () => servicesStores.get('flash')

// Flattened store shortcut
export const flashStore = {
  get flashes()       { return _store().flashes },
  get addFlash()      { return _store().flashStore.addFlash },
  get removeFlash()   { return _store().flashStore.removeFlash },
  // ...
}

// Action shortcut with composition
export const flash = {
  error: (message) => {
    _store().flashStore.error(message)
    servicesM.service('log:error', [message])
    return false
  },
  // ...
}
```

```js
// GOOD — src/shortcuts/services-shortcut.js (pure barrel)
export { ajax, req, url } from '@brugmann/vuemann/src/shortcuts/ajax-shortcut.js'
export { auth, authStore } from '@brugmann/vuemann/src/shortcuts/auth-shortcut.js'
export { flash, flashStore } from '@brugmann/vuemann/src/shortcuts/flash-shortcut.js'
export { ws } from '@brugmann/vuemann/src/shortcuts/websocket-shortcut.js'
// ...
```

## Constraints

- **No logic in `services-shortcut.js`**: only `export ... from`. Any logic (composition, getters, wrappers) lives in the shortcut of the service concerned.
- **No circular dependency between shortcuts**: a shortcut needing a primitive from another service calls `servicesM.service('xxx:method', ...)` directly rather than importing another shortcut. Avoids cycles and keeps each file independent.
- **The flattened shortcut uses getters** (never direct assignments): the registry replaces the entry on registration, so a value captured at import time would point to an empty `{}` forever. Each getter must call `servicesStores.get('<name>')` on every access.
- **No optional chaining `?.` on the sub-object access**: if the store is not registered at the call site, it is an init bug that must blow up immediately (`TypeError` with a stack trace pointing to the shortcut). `?.` would hide that bug by propagating a silent `undefined` that crashes elsewhere without context.
- **No import from `services-shortcut.js` inside the shortcuts**: it would create a barrel ↔ shortcut cycle. Import the needed primitives directly (`servicesM`, `servicesStores`).

## When a service has NO shortcut

A service used internally only (not exposed to components nor to other services via `services-shortcut.js`) does not need a shortcut. Example: a boot service that only does initialization.
