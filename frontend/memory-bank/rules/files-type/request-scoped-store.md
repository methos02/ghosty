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

// BAD
const novels = ref([])
export const useNovelStore = () => ({ novels, novelStore: { setNovels } })
```

Each store exposes `serialize()` / `hydrate()` and is read through `useXStore()` (`inject`). A store rendered at SSR has exactly one `{ name, key, create }` entry in `STORE_ENTRIES` of `src/ssr/store-registry.js`; never create, `provide()`, serialize or hydrate it by hand in `ssr/app.js` or the engine — a store missing from the registry is neither provided nor sent to the browser. Guarded by the test `creates isolated stores per call (request-scoped)`, in each store's `createXStore` test and in `tests/ssr/store-registry/store-registry.createStores.test.js`.

Passing the refs in as `xStore(state)` to lift them into the factory was tried and rejected: the state ends up listed three times (signature, allocation, returned object).
