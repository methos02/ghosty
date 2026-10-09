---
paths:
  - "src/**/*.vue"
---
# Teleport Nested Dialogs

A `DialogComponent` (native `<dialog>`) instantiated in the subtree of another `DialogComponent` MUST be wrapped in `<Teleport to="body">`. A native `<dialog>` nested in an open one has unreliable visibility: the closed inner content leaks into the parent dialog. This is browser behaviour that jsdom tests do not cover.

```vue
<!-- BAD -->
<DialogComponent ref="outer">
  <NovelManageForm />
  <DialogComponent ref="inner" />
</DialogComponent>

<!-- GOOD -->
<DialogComponent ref="outer">
  <NovelManageForm />
  <Teleport to="body">
    <DialogComponent ref="inner" />
  </Teleport>
</DialogComponent>
```
