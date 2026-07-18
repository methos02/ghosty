---
paths:
  - "src/**/*.js"
---
# Prefer Internal Export For Testability

When a function is called by other functions of the **same module** AND must be mockable by tests (`vi.spyOn`), expose it through an `xxxInternal` export and call it through that object so the spy can take effect. Without going through the object, the local call captures the original reference and the spy never fires.

Don't apply blindly: use it only when testability requires it.

```js
// GOOD - recursion through the Internal object, spy-able
const initService = async (app, name, context) => {
  if (name === 'auth') { await servicesInitInternal.initDependencies(app, name, context) }
}
const initDependencies = async (...) => { ... }

export const servicesInit = { initServices }
export const servicesInitInternal = { initService, initDependencies }

// BAD - direct local call, not spy-able
const initService = async (app, name, context) => {
  if (name === 'auth') { await initDependencies(app, name, context) }
}
```
