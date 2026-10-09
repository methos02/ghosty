---
paths:
  - "src/apis/**/stores/**/*.js"
  - "src/**/*.vue"
---
# Store Data Only

A store holds data a request produced and that `serialize()` / `hydrate()` must carry: no `req()`, no controller call. Split stores by concern (filters apart from the collection) instead of growing one.

- Transient interaction state (request in flight, opened panel, hovered row) stays local to the component that owns the interaction. The loading status of the data a composable itself loads belongs to that composable (`composable.md`); neither goes in a store. Before promoting such a flag to a store to share it, establish what the sharing protects: if the server is idempotent, it protects nothing.
- When a view must change a value a store owns, the store gains a mutator, never a copy of the value elsewhere (two sources of truth, plus an SSR leak when the copy sits at module scope).
- The mutator applies what the API returned (the response is authoritative) instead of recomputing locally (`+1` / `-1` drifts when another user acts on the same record), and ignores a stale answer: if the store no longer holds the record the response concerns, do nothing.

**BAD**

```js
const likePending = ref(false)
const setLikePending = value => {
  likePending.value = value
}
```

**GOOD**

```js
const setChapterLike = (chapterId, like) => {
  if (chapter.value?.id !== chapterId) {
    return
  }
  chapter.value = { ...chapter.value, like }
}
```
