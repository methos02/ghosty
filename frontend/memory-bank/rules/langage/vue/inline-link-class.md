---
paths:
  - "src/**/*.vue"
  - "src/assets/scss/**"
---
# Inline Link Class

A link inside a sentence uses the global `.link-inline` class (`assets/scss/layout/_link.scss`): `--primary` colour, semibold, no underline, underline on hover. Never restyle links locally with `:deep(a)` / `:slotted(a)`.

```vue
<!-- BAD -->
<style scoped>
.message :slotted(a) { color: var(--primary); text-decoration: underline; }
</style>

<!-- GOOD -->
<router-link :to="route" class="link-inline">{{ title }}</router-link>
```
