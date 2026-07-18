---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Function & Callback Body Style

Array-method callbacks (`filter`/`map`/`some`/`every`/`reduce`) stay **implicit-return arrows** — no block, no `return`. Use a **block body with an explicit `return`** for functions with real control flow: guards, multiple steps, or building an object from locals.

```js
// BAD - block body + return for a trivial callback
const names = users.map(user => { return user.name })

// GOOD - implicit-return callback
const names = users.map(user => user.name)

// GOOD - single expression, implicit return is fine
const fullName = (user) => `${user.firstName} ${user.lastName}`

// GOOD - guards + multiple steps → block body, explicit return
const resolveLabel = (item) => {
    if (!item.visible) { return '' }
    const base = formatName(item)
    return `${base} (${item.code})`
}
```
