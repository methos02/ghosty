---
paths:
  - "src/**/stores/**/*.js"
  - "src/**/composables/**/*.js"
  - "src/**/composables/**/Use*.js"
---
# Composable Store Export Pattern

Applies to composables and **client-only** stores. A store rendered at SSR follows `request-scoped-store.md` instead — the module-level refs below leak between visitors on the server.

Composables and stores must return refs/computed at the top level and group functions in a named object matching the store name.

The named object contains **only functions** — never refs. Refs live at the top level of the composable.

Never wrap a composable call in `reactive()` — it masks refs and breaks the contract. Always destructure.

```js
// GOOD - refs at top level, functions in named object
const chapter = ref()
const selectedPrices = ref()

const setChapter = (x) => { chapter.value = x }
const clearStore = () => { chapter.value = undefined }

export const useChaptersStore = () => {
  return {
    chapter,
    selectedPrices,
    chaptersStore: {
      setChapter,
      clearStore,
    },
  }
}

// Consumer
const { chapter, selectedPrices, chaptersStore } = useChaptersStore()
chapter.value                       // script
chaptersStore.setChapter(x)    // function

// BAD - flat, name collisions, no separation
export const useChaptersStore = () => ({
  chapter,
  selectedPrices,
  setChapter,
  clearStore,
})

// BAD - ref inside the functions object
export const useChaptersStore = () => ({
  selectedPrices,
  chaptersStore: {
    chapter,        // ← ref inside the named object, forbidden
    setChapter,
  },
})

// BAD - reactive() hides refs and breaks contract
const chaptersStore = reactive(useChaptersStore())
chaptersStore.chapter  // looks like a value, actually was a ref
```

Composables with no refs still group functions in the named object:

```js
// GOOD
export const useTranslatable = () => ({
  translatable: { translate },
})

// Consumer
const { translatable } = useTranslatable()
translatable.translate(obj, 'label')
```
