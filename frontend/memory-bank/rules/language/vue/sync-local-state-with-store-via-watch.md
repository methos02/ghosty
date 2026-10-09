---
paths:
  - "src/**/*.vue"
---
# Sync Local State With Store Via Watch

A Vue input that mirrors a shared reactive store value must `watch` it, not initialize once in `onMounted`. The store can be mutated by sibling components, and a one-shot copy will not react.

When the input also writes back to the store, prefer `computed({ get, set })` or `defineModel` over a manual `watch` + `@input` pair — the two-way binding stays in one place.

```js
// BAD - one-shot copy on mount, ignores later store mutations
onMounted(() => {
    searchGenre.value = novelData.value.genre?.name ?? ''
})

// GOOD - reactive sync, picks up sibling-driven store changes
watch(() => novelData.value.genre?.name, (name) => {
    searchGenre.value = name ?? ''
})
```
