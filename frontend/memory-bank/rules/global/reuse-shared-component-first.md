---
paths:
  - "src/views/**/*.vue"
  - "src/components/**/*.vue"
---
# Reuse Shared Component First

Before writing button-loading, dialog, dropdown or paginator behaviour, read `src/components/` and the Vuemann equivalent. If the shared component covers the behaviour but not the exact rendering, extend it additively (a named slot, an optional prop) so every caller benefits and nobody maintains a second implementation. Duplicating it in the caller is the last resort, with a stated reason why the shared component could not be extended.

**BAD**

```vue
<button :disabled="loading" @click="run">
  <span v-if="loading" class="spinner"></span>
  {{ count }}
</button>
```

**GOOD**

```vue
<LoaderComponent :cb="run">
  {{ count }}
</LoaderComponent>
```
