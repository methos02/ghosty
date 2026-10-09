---
paths:
  - "src/services/*/*-service.js"
  - "src/services/*/src/*-setup.js"
  - "src/services/*/*-init.js"
---
# Service Setup

MUST put lifecycle code (setup, stop, DOM listeners, handlers) in `src/services/<name>/src/<name>-setup.js`. The init references it with `setup: <name>Setup.setup`. `<name>-service.js` keeps the public API only.

Why: a lifecycle method on the registered service object leaks through `servicesM.service('<name>:start')`. Splitting limits the registry to methods that have a shortcut.

```js
// BAD
export const xxxService = { start, stop, list }
setup: xxxService.start
```

```js
// GOOD
export const xxxService = { list }
export const xxxSetup = { setup }
export const xxxSetupInternal = { stop, handlePageHide }
setup: xxxSetup.setup
```

BAD puts `start` / `stop` on `xxx-service.js` and references it from `xxx-init.js`. GOOD keeps `xxx-service.js` minimal, exports `xxxSetup` from `src/xxx-setup.js` and references it from `xxx-init.js`.

`setup` returns `{ status: BOOT_STATUS.SUCCESS }` (or an aborted status). Reference: `src/services/tabs/src/tabs-setup.js`. The public mirror of the service lives in `src/shortcuts/<name>-shortcut.js` ([service-shortcut](service-shortcut.md)).
