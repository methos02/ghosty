---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
  - "tests/**/*.js"
---
# Cleanup on Close / onUnmounted / afterAll, Not on Open / onMounted / beforeAll

Cleanup state on `close()` / `onUnmounted()` / `afterEach()` / `afterAll()`, never on `open()` / `onMounted()` / `beforeEach()` / `beforeAll()`. Create a dedicated `cleanup()` function when the logic is reused.

**Why**: Cleaning on open/mount/before leaves state dirty for the next consumer. The next user inherits a clean slate only if the previous one cleaned up on exit. This includes resetting a dialog form: wire it on `@dialog-close`, never in the `openForCreate/openForEdit` handlers (which only set edit data + show the dialog).

## Components and dialogs

```js
// GOOD - cleanup on close
const cleanup = () => { chapterId.value = undefined; novels.value = [] }
const close = () => { cleanup(); dialog.value.close() }
const open = (id) => { chapterId.value = id; loadData(); dialog.value.show() }

// BAD - cleanup on open, state left dirty on close
const open = (id) => { chapterId.value = undefined; chapterId.value = id; ... }
const close = () => { dialog.value.close() }
```

### Dialog form: reset on the `@dialog-close` event, not in open handlers

Bind cleanup to the `@dialog-close` event, not to a wrapper `close()` method. `DialogComponent`'s built-in close (the ✕) emits `dialog-close` without going through your wrapper — only the event binding guarantees the next open starts clean. Open handlers just set edit data (when editing) and call `dialog.value.show()`.

```vue
<!-- GOOD - reset wired on the close event -->
<DialogComponent ref="dialog" @dialog-close="cleanup()">
<script setup>
const openForCreate = () => { dialog.value.show() }
const openForEdit = (entity) => { form.fill(Dto.toFormEdit(entity)); dialog.value.show() }
</script>

<!-- BAD - reset on open; next open after the ✕ starts dirty -->
const openForCreate = () => { cleanup(); dialog.value.show() }
```

Don't clear validation errors manually either (`@dialog-show="form.clearErrors()"`): vuemann's form service clears them on submit, so the call is dead code and drags an otherwise-unused `form` import into the component.

## Lifecycle hooks

```js
// GOOD
onMounted(() => { ws.open('chapter.ws'); loadData() })
onUnmounted(() => { ws.close('chapter.ws'); store.clearData() })
```

## Shared stores with page-local state

When a page uses a shared store whose state must not leak between visits (form stores, wizard stores, per-page caches), reset in `onUnmounted`, not at script setup top-level.

```vue
<!-- BAD - reset at setup top-level leaves store dirty on unmount -->
<script setup>
const { formData, reset } = useUserCreateForm()
reset()
</script>

<!-- GOOD -->
<script setup>
import { onUnmounted } from 'vue'
const { formData, reset } = useUserCreateForm()
onUnmounted(() => { reset() })
</script>
```

## Tests

Same principle: teardown in `afterEach`/`afterAll`, never in `beforeEach`/`beforeAll`.

```js
// GOOD
afterEach(() => { vi.clearAllMocks() })
afterAll(() => { store.reset() })

// BAD - cleanup before the test reverses the responsibility
beforeEach(() => { vi.clearAllMocks(); store.reset() })
```

See [tests/test-cleanup.md](../tests/test-cleanup.md) for which `vi.*` helper to use.
