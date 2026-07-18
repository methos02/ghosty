---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Compact Patterns

Decompose compact one-liners into explicit multi-step code. Targets: complex `reduce`, nested ternaries, long method chains, conditional spread `...(cond && { key })`, **object literals combining a spread with a non-trivial expression** (deep property access, `??`, ternary, function call).

```js
// BAD - spread + deep access + ?? on a single line
formData.value = { ...formData.value, resourceTypeId: searchFiltersStore.filters.value.resourceTypeId ?? 1 }

// GOOD - one property per line, intent is scannable
formData.value = {
    ...formData.value,
    resourceTypeId: searchFiltersStore.filters.value.resourceTypeId ?? 1
}
```

Short trivial literals (`{ id, label }`, `{ a, b }`) stay on one line — the rule targets long expressions only.
