---
paths:
  - "src/**/services/*/*-service.js"
  - "src/**/services/*/src/*-setup.js"
  - "src/**/services/**/*-init.js"
---
# Service Setup File

Lifecycle code for a service (setup, stop, DOM listeners, handlers, anything tied to service start/teardown) goes in a dedicated `xxx-setup.js` file under the service's `src/`. The `*-init.js` `setup` field references `xxxSetup.setup`. Keep `xxx-service.js` for the public API only — methods consumed by the helper and by child apps.

Reason: lifecycle methods registered on the service object leak out via `servicesM.service('xxx:start')`, an unintended public surface. Splitting forces the registry to expose only the methods that have a corresponding helper.

## Layout

```
src/services/xxx/
├── xxx-service.js       # public API only (list, get, ...)
├── xxx-init.js          # setup: xxxSetup.setup
└── src/
    ├── xxx-setup.js     # setup, stop, handlers, listeners
    └── ...              # internal models / state
```

The matching `xxx-shortcut.js` (public API mirror) lives in `src/shortcuts/`.

## Examples

```js
// BAD - lifecycle on registered service object
// xxx-service.js
const start = () => { /* opens BroadcastChannel, adds listeners */ }
const stop = () => { /* closes channel, removes listeners */ }
const list = () => { ... }
export const xxxService = { start, stop, list }

// xxx-init.js
setup: xxxService.start  // start leaks via servicesM.service('xxx:start')
```

```js
// GOOD - lifecycle isolated, registered service stays minimal
// xxx-service.js
const list = () => { ... }
export const xxxService = { list }

// xxx-setup.js
const setup = () => { /* opens channel, adds listeners */ }
const stop = () => { /* closes channel, removes listeners */ }
export const xxxSetup = { setup }
export const xxxSetupInternal = { stop, handlers... }

// xxx-init.js
setup: xxxSetup.setup
```

Reference implementation: `src/services/tabs/src/tabs-setup.js`.
