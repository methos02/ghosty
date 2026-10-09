---
paths:
  - "src/**/*.vue"
---
# No Duplicated Reactive Side Effects

A `watch` at the consumer of a store value is the single place for reactions to that value. MUST NOT replicate the same logic at each site that mutates it: the watch fires whoever triggered the change.

```js
// BAD
const applyGenre = novel => {
  const previousId = store.genre?.id
  store.genre = novel.genre
  if (previousId !== novel.genreId) {
    store.chapter = undefined
  }
}

// GOOD
const applyGenre = novel => {
  store.genre = novel.genre
}
```

The chapter component owns the reaction:

```js
watch(() => store.genre?.id, newId => {
  if (store.chapter?.genreId !== newId) {
    store.chapter = undefined
  }
})
```
