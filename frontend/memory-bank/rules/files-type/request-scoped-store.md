---
paths:
  - "src/**/stores/**/*.js"
---
# Request-Scoped Store

A store whose data is rendered at SSR creates its refs **per call**, never at module scope: `server.js` is a single Node process shared by every visitor, so a module-level `ref()` leaks state between them. Supersedes `composable-store-export-pattern` for these stores.

Two functions. `xStore()` holds the behaviour; `createXStore()` states the return type — JavaScript has no return annotation, and `createXStore` read alone is as ambiguous as "createX + Store". **The wrapper is not dead indirection, do not remove it.**

```js
// GOOD
const novelStore = () => {
  const novels = ref([])
  const setNovels = value => {
    novels.value = value
  }
  return { novels: readonly(novels), setNovels, serialize, hydrate }
}

export const createNovelStore = () => novelStore()

// BAD - module-level ref, shared by every SSR request
const novels = ref([])
export const useNovelStore = () => ({ novels, novelStore: { setNovels } })
```

Each store exposes `serialize()` / `hydrate()`, is provided per request in `ssr/app.js`, and is read through `useXStore()` (`inject`). Guarded by the test `creates isolated stores per call (request-scoped)`.

Passing the refs in as `xStore(state)` to lift them into the factory was tried and rejected: the state ends up listed three times (signature, allocation, returned object).
