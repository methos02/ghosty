---
paths:
  - "src/**/services/*/*-init.js"
---
# Service Init Rules

`*-init.js` files are the bridge layer between a service and the rest of the framework. They declare what the service exposes to the framework: services (methods), setup, dependencies, plugin, and **store** (refs + methods registered in `servicesStores`).

## Init shape

```js
import { authService } from '@brugmann/vuemann/src/services/auth/auth-service.js'
import { useAuthStore } from '@brugmann/vuemann/src/services/auth/src/auth-store.js'

export const authInit = {
  dependencies: ['ajax'],
  services: authService,
  store: useAuthStore(),
}
```

The `store` field is the rule-compliant composable result (refs at top + nested functions object — see [composable-store-export-pattern.md](composable-store-export-pattern.md)). `servicesInit.initServices` registers the whole object under the service name — no per-ref or per-method registration needed, no spread merge.

## Constraints

- Pure JS service files (`<name>-service.js`, `src/`, models, controllers, repositories) must never import a store. Only `*-init.js` is allowed to import the local store, because it is the integration point.
- Framework components must read cross-service refs via the `services-shortcut.js` re-exports (e.g. `import { authStore } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'` then `const { currentUser } = authStore`), never by importing a per-service store directly.
- The app boot must call `servicesInit.initServices(app, config)` — not `servicesM.initServices` directly — so that stores are registered before any component mounts.
