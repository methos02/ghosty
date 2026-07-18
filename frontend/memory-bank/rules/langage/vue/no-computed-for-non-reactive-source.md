---
paths:
  - "src/**/*.vue"
---
# No Computed For Non-Reactive Source

`computed()` memoizes a recomputation triggered by a dependency that changes. If the source does not change during the component's useful life (initialized once then read, constant, frozen prop), the `computed` has nothing to recompute — it is noise. Inline the expression in the template or use a plain `const`.

```vue
<!-- BAD - recurrence is loaded once then never changes; useless computed -->
<script setup>
const recurrence = ref()
onMounted(async () => { recurrence.value = await fetchRecurrence() })

const minDate = computed(() => recurrence.value?.startDate?.split('T')[0])
</script>
<template>
  <InputDateComponent :minDate="minDate" />
</template>

<!-- GOOD - no wrapping; the template reads the value directly -->
<template>
  <InputDateComponent :minDate="recurrence?.startDate?.split('T')[0]" />
</template>
```
