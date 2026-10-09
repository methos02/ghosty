---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Function Body Style

Readable, explicit code over compact code. Formatting limits are enforced by tools where they exist; this rule covers what they cannot express.

## Callback and body shape

- Array-method callbacks (`filter`, `map`, `some`, `every`, `reduce`) MUST be implicit-return arrows: no block, no `return`.
- A function with real control flow (guards, several steps, an object built from locals) MUST use a block body with an explicit `return`.

```js
// BAD
const names = users.map(user => { return user.name })

// GOOD
const names = users.map(user => user.name)

const resolveLabel = chapter => {
  if (!chapter.isPublished) {
    return ''
  }
  const base = formatTitle(chapter)
  return `${base} (${chapter.depth})`
}
```

## Length and complexity

SHOULD keep a function under 15 executable lines (blanks excluded; a multi-line condition or literal counts as one). Exceptions: a `switch` with many simple cases, object/array literals, DTO field mappings. ESLint already warns on `complexity` > 8 and `max-params` > 3, `max-depth` > 4, `max-lines` > 300; the 15-line limit is not tool-enforced.

When an `if` body has more than one logical line, extract it into a named internal function.

```js
// BAD
if (filters.genre?.id) {
  payload.genre_id = filters.genre.id
  payload.genre_depth = filters.genre.depth
}

// GOOD
if (filters.genre?.id) {
  Object.assign(payload, NovelDtoInternal.buildGenrePayload(filters.genre))
}
```

## Simplicity

MUST prefer the straightforward solution over a clever one: a reader must see which problem is solved. "Clever" is acceptable for a well-known codebase idiom, a measured performance need, or when the alternative is much longer without being clearer.

```js
// BAD
const nameFormat = [data.prefix, data.family_name, data.given_name].filter(Boolean).join(' ')

// GOOD
const nameFormat = data.prefix
  ? `${data.prefix} ${data.family_name} ${data.given_name}`
  : `${data.family_name} ${data.given_name}`

// BAD
const config = { ...baseConfig, ...(enableFeature && { feature: true }) }

// GOOD
const config = { ...baseConfig }
if (enableFeature) {
  config.feature = true
}
```

## Do not catch what cannot throw

A `try/catch` guards a specific exception path that exists in the supported runtime. MUST NOT wrap a call that cannot realistically throw (`sessionStorage`, `crypto.randomUUID` in supported browsers): the catch would hide a real future bug behind a silent fallback. Valid at system boundaries where the throw path is documented and reachable (user input parsing, third-party SDK, external API response).

```js
// BAD
try {
  return sessionStorage.getItem(KEY) ?? crypto.randomUUID()
} catch {
  return ''
}

// GOOD
return sessionStorage.getItem(KEY) ?? crypto.randomUUID()
```
