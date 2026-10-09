---
paths:
  - "src/**/*.vue"
---
# Vue Style Scope

MUST use `<style scoped>` by default. A non-scoped block registers global classes: the same class name in two components silently overrides one with the other. A class shared by two or more components MUST be lifted to the global stylesheet (`src/assets/scss/`); a component-local class stays scoped with a unique name.

```vue
<!-- BAD -->
<style lang="scss">
.badge { width: 16px; height: 10px; }
</style>
<style lang="scss">
.badge { width: 20px; height: 12px; }
</style>

<!-- GOOD -->
<style scoped>
.novel-card__badge { width: 20px; height: 12px; }
</style>
```
