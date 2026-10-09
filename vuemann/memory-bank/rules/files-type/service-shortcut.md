---
paths:
  - "src/shortcuts/*.js"
---
# Service Shortcut

Every Vuemann service consumed by components or other services has `src/shortcuts/<name>-shortcut.js`. `src/shortcuts/services-shortcut.js` is a pure barrel: `export ... from` only, no logic.

A pure primitive with no `servicesM` / `servicesStores` dependency is not a shortcut: it lives in `helpers/`. A boot-only service needs no shortcut.

## Content of `<name>-shortcut.js`

1. **Action shortcut**: wrappers over the service's actions via `servicesM.service('<name>:method', [...])`.
2. **Flattened store shortcut**: one getter per top-level ref and per method of the nested functions object, resolved through `servicesStores.get('<name>')`.
3. **Composition specific to the service** (`flash.error` composes store + log).

```js
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { servicesStores } from '@brugmann/vuemann/src/services/services-stores.js'

const _store = () => servicesStores.get('flash')

export const flashStore = {
  get flashes() {
    return _store().flashes
  },
  get addFlash() {
    return _store().flashStore.addFlash
  },
}

export const flash = {
  error: message => {
    _store().flashStore.error(message)
    servicesM.service('log:error', [message])
    return false
  },
}
```

```js
export { flash, flashStore } from '@brugmann/vuemann/src/shortcuts/flash-shortcut.js'
export { log } from '@brugmann/vuemann/src/shortcuts/log-shortcut.js'
```

## Constraints

- MUST use getters in a flattened shortcut, resolved on each access: the registry replaces its entry at registration, so a value captured at import time stays an empty `{}`.
- MUST NOT use `?.` on the store access: an unregistered store is an init bug that must throw at the shortcut.
- MUST NOT import another shortcut, nor `services-shortcut.js`, from a shortcut (cycles): call `servicesM.service('xxx:method', [...])` or import `servicesM` / `servicesStores`.
- MUST NOT put logic in `services-shortcut.js`.
