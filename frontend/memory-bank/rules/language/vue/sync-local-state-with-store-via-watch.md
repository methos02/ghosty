---
paths:
  - "src/**/*.vue"
---
# Sync Local State With Store Via Watch

A Vue input that mirrors a shared reactive store value MUST `watch` it, not copy it once in `onMounted`: sibling components can mutate the store, and a one-shot copy will not react.

When the input also writes back to the store, PREFER `computed({ get, set })` or `defineModel` over a manual `watch` + `@input` pair, so the two-way binding stays in one place.

```js
// BAD
onMounted(() => {
  searchGenre.value = novelFilter.value.genre?.name ?? ''
})

// GOOD
watch(() => novelFilter.value.genre?.name, name => {
  searchGenre.value = name ?? ''
})
```
