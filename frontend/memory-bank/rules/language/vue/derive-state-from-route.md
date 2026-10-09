---
paths:
  - "src/views/**/*.vue"
  - "src/config/routes-config.js"
---
# Derive State From Route

When one component serves several routes, Vue Router reuses the instance and does not replay `setup()`. State depending on the route MUST be a `computed` on `route.current()`, never a `ref` initialised at `setup()`. UI commands that change that state MUST navigate (`router.push`) instead of writing the state: the URL stays the single source of truth and back navigation works without extra code.

**BAD**

```js
const mode = ref(route.current().value.name === 'novel-create' ? 'create' : 'read')
```

**GOOD**

```js
const mode = computed(() => (route.current().value.name === 'novel-create' ? 'create' : 'read'))
const openCreate = () => router.push({ name: 'novel-create' })
```
