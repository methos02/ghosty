---
paths:
  - "src/**/*.vue"
---
# No Duplicated Reactive Side Effects

A `watch` placed at the consumer of a store value is the single source of truth for reactions to that value. Do not replicate the same logic at every site that mutates it — the watch fires regardless of who triggered the change.

```js
// BAD - auteur component mutates genre AND clears chapter,
// duplicating the watch already present in the chapter component
const applyGenre = (auteur) => {
    const previousId = store.genre?.id
    store.genre = auteur.genre
    if (previousId !== auteur.genreId) { store.chapter = undefined }
}

// GOOD - auteur component only mutates genre;
// chapter component owns the reaction via its own watch
const applyGenre = (auteur) => {
    store.genre = auteur.genre
}
// In chapter component:
watch(() => store.genre?.id, (newId) => {
    if (store.chapter?.genreId !== newId) { store.chapter = undefined }
})
```
