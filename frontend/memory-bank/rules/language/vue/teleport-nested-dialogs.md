---
paths:
  - "src/**/*.vue"
---
# Teleport Nested Dialogs

A `DialogComponent` instantiated in the subtree of another `DialogComponent` must be wrapped in `<Teleport to="body">`. The native `<dialog>` element has unreliable visibility when nested inside another open `<dialog>`: the content of the closed inner dialog leaks into the visible parent dialog.

```vue
<!-- BAD - inner dialog nested in the outer dialog's DOM -->
<DialogComponent ref="outer">
  <MyFormContent />
  <ConfirmDialogComponent ref="innerConfirm" />
</DialogComponent>

<!-- GOOD - inner dialog teleported to body -->
<DialogComponent ref="outer">
  <MyFormContent />
  <Teleport to="body">
    <ConfirmDialogComponent ref="innerConfirm" />
  </Teleport>
</DialogComponent>
```
