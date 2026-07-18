---
paths:
  - "src/**/*.vue"
---
# Prefer v-model and defineModel

Use `v-model` on parent side and `defineModel()` macro in child components. Never split into `:modelValue` + `@update:modelValue` manually.

```vue
<!-- BAD - manual modelValue binding -->
<MyInput
  :modelValue="model.name"
  @update:modelValue="model.name = $event"
/>

<!-- GOOD - v-model -->
<MyInput v-model="model.name" />
```

```js
// BAD - manual props/emit
const props = defineProps({ modelValue: { type: String } })
const emit = defineEmits(['update:modelValue'])

// GOOD - defineModel (Vue 3.4+)
const model = defineModel({ type: String, default: '' })
```
