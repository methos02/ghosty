---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Else

MUST NOT use `else` or `else if` in JavaScript, including `<script>` blocks of `.vue` files. Use early returns, or a ternary for a simple value.

Templates have no early return: `v-else` and `v-else-if` are allowed and PREFERRED for mutually exclusive blocks, since the compiler then guarantees that exactly one branch renders.

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

A component rendering variants (singular/plural, type, state) MUST declare each variant as a template block, never a `computed` returning the text or the target: the structure stays readable in the template. A component mounted by a parent via `v-if` keeps a single root ([single-root-for-conditional-mount](../language/vue/single-root-for-conditional-mount.md)).

```vue
<!-- BAD -->
<script setup>
const message = computed(() => (count === 1 ? t('like.one') : t('like.many')))
</script>

<!-- GOOD -->
<Translate v-if="count === 1" keypath="like_received_notification.one">…</Translate>
<Translate v-else keypath="like_received_notification.many">…</Translate>
```
