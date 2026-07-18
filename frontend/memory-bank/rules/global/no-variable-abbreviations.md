---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Explicit Variable Names

Use full, domain-specific variable names. No abbreviations, no generic names.

```js
// BAD
array.map(x => x.id)
array.map(item => item.id)
@input="(e) => handleInput(e)"

// GOOD
users.map(user => user.id)
sites.map(site => site.id)
@input="(event) => handleInput(event)"
```

| Avoid | Use |
|-------|-----|
| `e` | `event` |
| `i`, `x` | `index` |
| `el` | `element` |
| `err`, `res`, `req` | `error`, `response`, `request` |
| `item`, `element`, `data` | domain name: `user`, `site`, `novel` |
