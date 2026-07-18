---
paths:
  - "src/**/*.vue"
---
# Single-Root For Conditional Mount

A `.vue` component mounted by a parent via `v-if` must have a single-root template. Multi-root fragments combined with `v-if` produce rendering glitches under Vue 3 + Vite HMR: partial unmount, ghost siblings, triple render.

The root must be a **meaningful** element: a class expressing the intent (`f-column`, `card`, component name). Never a bare `<div>` with no attribute. If you already need a wrapper, merge the useful class onto the root rather than adding an extra level.

```vue
<!-- BAD - fragment, used as <MyComp v-if="..." /> upstream -->
<template>
  <div>header</div>
  <div>body</div>
  <SomeDialog />
</template>

<!-- BAD - single root but empty wrapper -->
<template>
  <div>
    <div class="f-column g-10">...</div>
    <div class="d-flex j-end">...</div>
  </div>
</template>

<!-- GOOD - single root, meaningful class -->
<template>
  <div class="my-comp f-column g-10">
    <div>header</div>
    <div>body</div>
    <SomeDialog />
  </div>
</template>
```
