---
paths:
  - "src/services/*/*-init.js"
---
# Service Init

`<name>-init.js` is the bridge between a service and the framework. It declares `dependencies`, `services` (public methods), `store`, `setup`, `plugin`, `routes`. Key list and order: [service-contract](service-contract.md).

```js
import { formService } from '@brugmann/vuemann/src/services/form/form-service.js'
import { useFormStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'

export const formInit = {
  dependencies: [],
  services: formService,
  store: useFormStore(),
  vuemann: true,
}
```

- `store` MUST be the composable result of the store export pattern (refs at top level + nested functions object). `servicesInit.initServices` registers the whole object under the service name: no per-ref registration, no spread.
- A service's public file (`<name>-service.js`) MUST NOT import its own store: `*-init.js` is the single place that wires it. Internal files under the service's `src/` MAY read their own store (`form-functions.js` reads `form-store.js`).
- Framework components MUST read another service's refs through `shortcuts/services-shortcut.js` (`import { authStore } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`), never by importing that service's store.
- Lifecycle code goes to `<name>-setup.js`: [service-setup](service-setup.md).
