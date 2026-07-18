# DialogComponent

Wraps native `<dialog>`. Import: `import Dialog from '@brugmann/vuemann/src/components/DialogComponent.vue'`

**Props:** `title` (String, ''), `closeCross` (Boolean, true), `closeBg` (Boolean, true)
**Methods:** `show()`, `close()`, `closeSilent()`, `toggle(state)`
**Exposed state:** `isOpen` (Ref\<boolean\>)
**Events:** `dialog-show`, `dialog-close` (also on Escape)
**Slot:** default

```vue
<button @click="dialog.show()">Open</button>
<Dialog ref="dialog" title="My title">content</Dialog>
```

## closeSilent

`closeSilent()` closes the dialog without emitting `dialog-close`. Use it when the parent handles its own close logic (e.g. after a save), avoiding the need for guards like `isSaving` in the `@dialog-close` handler.

```javascript
const save = async () => {
  await controller.save(entity.value)
  dialog.value.closeSilent()
}
```

## Unmounting slot content on close

When `@dialog-close` resets refs that the slot reads, a final render tick fires after the native `<dialog>` closes but before the slot unmounts. This can crash with errors like `Cannot read properties of undefined`. Wrap slot content with `v-if="dialog?.isOpen"` to unmount it cleanly:

```vue
<DialogComponent ref="dialog">
  <div v-if="dialog?.isOpen">
    <!-- content that reads composable state -->
  </div>
</DialogComponent>
```

`isOpen` is a reactive `Ref<boolean>` exposed by `DialogComponent`. It is `false` initially and stays in sync with all four open/close entry points (`show`, `close`, `closeSilent`, `toggle`).

## Patterns

### Single Entrance Point

`defineExpose({ open })` when one component opens the dialog.

### Multiple Entrance Points (Composable)

Module-level state composable when multiple components open the same dialog.

**Rules:** use `setDialog()` method (not composable arg) | single dialog instance at parent level (not per child) | reset state in `close()` not `open()` | wrap slot content with `v-if="dialog?.isOpen"` so close-time resets don't render undefined state

```javascript
// use-xxx-dialog.js
let dialog
const entity = ref()
const mode = ref('manage')
const isViewMode = computed(() => mode.value === 'view')
const isManageMode = computed(() => mode.value === 'manage')
const setDialog = (d) => { dialog = d }
const open = (data) => { entity.value = data; dialog.value.show() }
const close = () => { entity.value = undefined; mode.value = 'manage' }
export const useXxxDialog = () => ({ entity, mode, isViewMode, isManageMode, setDialog, open, close })
```

Dialog component: `onMounted(() => { setDialog(dialog) })` + `@dialog-close="close"`
Caller: `const { open } = useXxxDialog()` then `open(myData)`

### View/Manage Mode

`open(dataWithId)` → view | `open(dataWithoutId)` → manage | `switchToManage()` → manage (edit)

```vue
<DialogComponent ref="dialog">
  <div v-if="dialog?.isOpen">
    <ViewComponent v-if="isViewMode" />
    <ManageComponent v-if="isManageMode" />
  </div>
</DialogComponent>
```

## Print

`@media print` shows only dialog content. Siblings hidden. Use `setTimeout(() => window.print(), 300)` after `show()`.
