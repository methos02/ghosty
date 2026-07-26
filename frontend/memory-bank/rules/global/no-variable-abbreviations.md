---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Explicit Variable Names

Use full, domain-specific variable names. No abbreviations, no generic names, no bare single letters.

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
| `store` (bare) | domain-prefixed: `formStore`, `authStore` |

## Single Letters, Even for Disambiguation

A bare single letter (`a`, `b`, `x`, `y`) is never a valid identifier, including when two instances of the same thing need disambiguating in the same scope. Suffix the role or an index onto the full domain name instead.

```js
// BAD - two stores, disambiguated with bare letters
const a = useStore()
const b = useStore()

// GOOD - full name, suffixed to disambiguate
const storeA = useStore()
const storeB = useStore()
```

Grep check: any single-character identifier in a `const`/`let` declaration (`const a =`, `let x =`) outside of loop counters already covered by the `index` row above is a violation.
