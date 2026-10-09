---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Else Or V-Else

MUST NOT use `else if`, `else`, `v-else`, `v-else-if`. Use early returns, a ternary for a simple value, explicit `v-if` conditions.

Accepted cost: with independent `v-if` blocks the compiler no longer guarantees that exactly one branch renders. Two conditions can both hold, or none: the author owns exhaustiveness. MUST write mutually exclusive conditions that cover every case, **including the empty / zero case** (`count === 0` renders nothing unless a block says so).

```js
// BAD
if (user.isAdmin) { return 'admin' }
else if (user.isActive) { return 'active' }
else { return 'inactive' }

// GOOD
if (user.isAdmin) {
  return 'admin'
}
if (user.isActive) {
  return 'active'
}
return 'inactive'
```

## Template variants

A component rendering variants (singular/plural, type, state) MUST declare each variant as a template block guarded by an explicit `v-if`, never a `computed` returning the text or the target: the structure stays readable in the template. A component mounted by a parent via `v-if` keeps a single root ([single-root-for-conditional-mount](../language/vue/single-root-for-conditional-mount.md)).

```vue
<!-- BAD -->
<div v-if="loading">Loading...</div>
<div v-else>Content</div>

<script setup>
const message = computed(() => (count === 1 ? t('like.one') : t('like.many')))
</script>

<!-- GOOD -->
<div v-if="loading">Loading...</div>
<div v-if="!loading">Content</div>

<Translate v-if="count === 1" keypath="like_received_notification.one">…</Translate>
<Translate v-if="count > 1" keypath="like_received_notification.many">…</Translate>
```
