---
paths:
  - "src/**/*.vue"
  - "src/**/stores/**/*.js"
---
# Prefer Reactive Store Over Events

MUST use a reactive store so the UI updates on its own. The component that calls an API owns the full consequence: error handling, flash, store update, cleanup. MUST NOT emit an event for the parent to finish the job.

```js
// BAD
const deleteChapter = async chapterId => {
  await ChapterController.destroy(chapterId)
  emit('chapter-deleted', chapterId)
}

// GOOD
const { chapterStore } = useDraftStore()

const deleteChapter = async chapterId => {
  const result = await ChapterController.destroy(chapterId)
  if (!ajaxHelper.isSuccess(result.status)) {
    flash.errorT('error.key')
    return
  }
  flash.successT('success.key')
  chapterStore.remove(chapterId)
  close()
}
```

Events remain appropriate for:
- generic reusable components at a library boundary;
- native interactions (`@click`, `@submit`);
- handing a result to the parent (`emit('save', formData)`);
- cross-feature communication where features must not know each other's stores.
