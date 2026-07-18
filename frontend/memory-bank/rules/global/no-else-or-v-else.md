---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No else-if / else

Never use `else if`, `else`, `v-else`. Prefer early returns, ternary for simple values, explicit `v-if` conditions.

```js
// BAD
if (user.isAdmin) { return 'admin' }
else if (user.isActive) { return 'active' }
else { return 'inactive' }

// GOOD
if (user.isAdmin) { return 'admin' }
if (user.isActive) { return 'active' }
return 'inactive'

// Ternary for simple values
const label = count > 0 ? 'Has items' : 'Empty'
```

```vue
<!-- BAD -->
<div v-if="loading">Loading...</div>
<div v-else>Content</div>

<!-- GOOD -->
<div v-if="loading">Loading...</div>
<div v-if="!loading">Content</div>
```
