---
paths:
  - "src/**/*.vue"
---
# Vue `<style>` Scope Rules

Default to `<style scoped>`. A non-scoped block registers global classes — the same class name in two components creates a silent global override. If a class is shared by ≥2 components, lift it to the global stylesheet (`src/assets/main.scss`). Keep scoped blocks only for component-local classes.

```vue
<!-- BAD - same class redefined in two SFCs, non-scoped -->
<!-- CardA.vue -->
<style lang="scss">
.badge { width: 16px; height: 10px; }
</style>

<!-- CardB.vue -->
<style lang="scss">
.badge { width: 20px; height: 12px; } /* silently overrides CardA at runtime */
</style>

<!-- GOOD - shared class lives in main.scss, components only reference it -->
/* src/assets/main.scss */
.badge { width: 16px; height: 10px; }

<!-- GOOD - component-local class stays scoped with a unique name -->
<!-- AdminTable.vue -->
<template>
  <span class="admin-badge"></span>
</template>
<style scoped>
.admin-badge { width: 48px; height: 22px; }
</style>
```
