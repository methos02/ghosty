# DelayedLoaderComponent

Displays loader only after a configurable delay, preventing flickering for fast loads.

`import DelayedLoader from '@brugmann/vuemann/src/components/DelayedLoaderComponent.vue'`

**Slot:** default — loader content (default: FontAwesome spinner)

**Props:** `loading` (Boolean, false — loading state), `delay` (Number, 200 — ms before showing loader)

If `loading` becomes `false` before the delay, nothing is shown. Timeout is cleaned up on unmount.

```vue
<!-- Default spinner -->
<DelayedLoaderComponent :loading="loading" />

<!-- Custom content -->
<DelayedLoaderComponent :loading="loading">
  <p>Chargement...</p>
  <i class="fa-solid fa-spinner fa-spin fs-600"></i>
</DelayedLoaderComponent>

<!-- Custom delay -->
<DelayedLoaderComponent :loading="loading" :delay="500" />
```
