---
paths:
  - "src/**/*.vue"
---
# Inline Class Binding

For simple conditional classes, use inline `:class` object syntax. Only extract to a function when logic is complex, reused, or requires computation beyond boolean checks.

```vue
<!-- BAD - unnecessary function -->
<li :class="['d-flex j-between', getStatusClass(site)]">

<!-- GOOD - inline object syntax -->
<li
    class="d-flex j-between"
    :class="{
        'color-primary-300': site.hasValue,
        'color-neutral-700': !site.hasValue
    }"
>
```
