---
paths:
  - "src/config/**/*.js"
  - "src/main.js"
  - "src/**/*.vue"
  - "src/**/*.js"
---
# ConfigLoader Usage

Config modules registered through `ConfigLoader.init({...})` must be **plain data objects**, never service objects with methods. Lookups go through `ConfigLoader.get`/`ConfigLoader.find` directly — no wrapper helper duplicating the lookup. Use `.get` when the value MUST exist (fail loud on broken config); use `.find` with a default when the lookup may legitimately miss. Only register a config in `ConfigLoader.init` if at least one consumer reads it back — dead registrations are noise.

```js
// BAD - config module is a service object hiding ConfigLoader behind a method
const CONFIG = { 1: { suffix: 'box' }, 2: { suffix: 'room' } }
export const resourceTypeConfig = {
  getConfig: (id) => CONFIG[id] ?? DEFAULT_CONFIG
}
// consumer:
const mode = resourceTypeConfig.getConfig(id).authorMode

// GOOD - plain data registered once, queried via ConfigLoader at the consumer
// src/config/resource-type-config.js
export const resourceTypeConfig = {
  1: { suffix: 'box',  authorMode: 'single'   },
  2: { suffix: 'room', authorMode: 'multiple' }
}
// src/main.js
ConfigLoader.init({ resourceType: resourceTypeConfig, ... })
// anywhere - dynamic path lookup directly in a computed
const mode = computed(() =>
  ConfigLoader.find(`resourceType.${id.value}.authorMode`, 'single')
)
```

## Read config through ConfigLoader, never by importing the config module

Never `import { xxxConfig } from '@/config/xxx-config.js'` at a consumer — read the value with `ConfigLoader.get('<namespace>.<key>')`. Direct imports are reserved for the `ConfigLoader.init` call sites (`src/main.js`, `vitest.setup.js`). Any namespace read at runtime must be registered in **both** init sites — a missing registration is silent until the first `get`, which throws `Key "…" not found`.

## Never call ConfigLoader.get() at module level

`ConfigLoader.init()` runs in the body of `main.js`, which executes **after** the whole import graph reachable from `App.vue` has been evaluated. A module-level `get()` therefore throws `Key not found` at boot — and the tests do not catch it, because `vitest.setup` runs `init` before the test modules import. Call `get` inside the function that needs the value; if the derived value is expensive, memoize inside the accessor — never hoist it to module scope.

```js
// BAD - evaluated at import time, before ConfigLoader.init has run
const dayStartMinutes = timeToMinutes(ConfigLoader.get('calendar.dayStart'))

// GOOD - evaluated at call time
const dayStartMinutes = () => timeToMinutes(ConfigLoader.get('calendar.dayStart'))
```
