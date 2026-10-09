---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
  - "tests/**/*.js"
---
# Cleanup On Close Or Unmount

MUST clean state on exit (`close()`, `onUnmounted()`, `afterEach()`, `afterAll()`), never on entry (`open()`, `onMounted()`, `beforeEach()`, `beforeAll()`). Cleaning on entry leaves state dirty for the next consumer. Extract a `cleanup()` function when the logic is reused.

## Dialogs

Wire the reset on `@dialog-close`, not in a wrapper `close()`: `DialogComponent`'s built-in close (the cross) emits `dialog-close` without going through your wrapper. Open handlers only set edit data and call `dialog.value.show()`. Do not clear validation errors by hand (`@dialog-show="form.clearErrors()"`): the form service clears them on submit.

```vue
<!-- GOOD -->
<DialogComponent ref="dialog" @dialog-close="cleanup()">
<script setup>
const openForCreate = () => { dialog.value.show() }
const openForEdit = chapter => { formData.value = ChapterDto.toFormEdit(chapter); dialog.value.show() }
</script>

<!-- BAD -->
const openForCreate = () => { cleanup(); dialog.value.show() }
```

## Lifecycle and shared stores

A shared store carrying page-local state (form, wizard, per-page cache) MUST be reset in `onUnmounted`, not at setup top level.

```js
// GOOD
onMounted(() => { loadNotifications() })
onUnmounted(() => { notificationStore.clear() })

// BAD
const { resetForm } = useChapterForm()
resetForm()
```

## Tests

Same principle: teardown in `afterEach` / `afterAll`, never `beforeEach` / `beforeAll`. Which `vi.*` helper to use: [test-cleanup](../tests/test-cleanup.md).
