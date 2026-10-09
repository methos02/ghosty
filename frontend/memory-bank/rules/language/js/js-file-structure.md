---
paths:
  - "src/**/*.js"
---
# JS File Structure

Each group of functions is declared **immediately above its own export object**: public functions above the public export, internals above the `Internal` export. Functions and export object properties are sorted **alphabetically** within each group. Export object names follow the file's domain (e.g., `dateHelper` / `dateHelperInternal`) — `module` / `moduleInternal` below are placeholders.

Use the `Internal` export pattern when helpers are not part of the public API but must be spy-able in tests.

```js
// GOOD
const mainFunction = () => {
    if (moduleInternal.helperA()) { ... }
    moduleInternal.helperB()
}

export const module = { mainFunction }

const helperA = () => { ... }
const helperB = () => { ... }

export const moduleInternal = { helperA, helperB }
```

Internal helpers **must** be called via `moduleInternal.*`, not directly. A direct call captures the local `const` through lexical closure; `vi.spyOn(moduleInternal, 'helperA')` replaces the property on the object, not the closure binding, so spies and mocks on direct calls silently no-op. Going through the object makes the lookup dynamic per call, so spies take effect.

Routing through the object is also what makes the file readable: at every call site, `helper(...)` means public API and `moduleInternal.helper(...)` means plumbing — the reader sees the module's shape without cross-referencing the export objects.

A file that does not follow this structure is brought fully into conformance when it is touched — see [boy-scout-cleanup-on-touch](../../global/boy-scout-cleanup-on-touch.md).

**Exception**: if a helper is already public, call it via the public object — no `Internal` export needed:

```js
// GOOD — sanitize is public → call via wordHelper.*
const sanitize = (string) => { ... }
const uppercase = (string) => { return wordHelper.sanitize(string).toUpperCase() }
export const wordHelper = { sanitize, uppercase }
```

```js
// BAD — sanitize is already public, redundant Internal export
export const wordHelper = { sanitize, uppercase }
export const wordHelperInternal = { sanitize }
```
