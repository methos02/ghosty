---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Compact Patterns

MUST decompose compact one-liners into explicit steps. Targets: complex `reduce`, nested ternaries, long method chains, conditional spread `...(cond && { key })`, **object literals combining a spread with a non-trivial expression** (deep property access, `??`, ternary, function call).

Complexity-driven, unlike [multiline-object-literal](multiline-object-literal.md), which is count-driven. A short trivial literal (`{ id, label }`) stays on one line.

```js
// BAD
formData.value = { ...formData.value, genreId: filterStore.filters.value.genreId ?? 1 }

// GOOD
formData.value = {
  ...formData.value,
  genreId: filterStore.filters.value.genreId ?? 1,
}
```
