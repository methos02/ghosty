---
paths:
  - "src/**/*.vue"
---
# Display Variants As v-if Blocks

When a component renders variants (singular/plural, type, state), each variant is a template block guarded by an explicit `v-if`. Never a `computed` returning the text or the target: the structure must be readable in the template. Respect `single-root-for-conditional-mount.md`.

```vue
<!-- BAD -->
<script setup>
const message = computed(() => (count === 1 ? t('like.one', params) : t('like.many', params)))
</script>

<!-- GOOD -->
<Translate v-if="notification.payload.count === 1" keypath="like_received_notification.one">…</Translate>
<Translate v-if="notification.payload.count > 1" keypath="like_received_notification.many">…</Translate>
```
