---
paths:
  - "src/**/*.vue"
---
# Single Root For Conditional Mount

A `.vue` component mounted by a parent through `v-if` MUST have a single-root template. Multi-root fragments combined with `v-if` are reported to glitch under Vue 3 + Vite HMR (partial unmount, ghost siblings, triple render); not re-verified here.

The root MUST be a **meaningful** element: a class expressing intent (`f-column`, `card`, the component name), never a bare `<div>`. When a wrapper is needed anyway, put the useful class on the root instead of adding a level.

```vue
<!-- BAD -->
<template>
  <div>header</div>
  <div>body</div>
</template>

<!-- BAD -->
<template>
  <div>
    <div class="f-column g-10">…</div>
  </div>
</template>

<!-- GOOD -->
<template>
  <div class="chapter-panel f-column g-10">
    <div>header</div>
    <div>body</div>
  </div>
</template>
```
