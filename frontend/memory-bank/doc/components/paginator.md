# PaginatorComponent

`import Paginator from '@brugmann/vuemann/src/components/PaginatorComponent.vue'`

**Slot:** default — content for `type="infinite"` (scrollable container)

**Props:** `type` (String, 'classic'), `cb` (Function, required), `params` (Object `{ page, size, total }`, required)

**Types:** `classic` (numbered pages + prev/next), `load-more` (button, increments page), `range` (element range "1 to 20 of 100"), `infinite` (auto-detect scroll bottom, uses slot)

Auto-hides if `totalPages <= 1`. Callback receives `(page, size)`. Async supported.

```vue
<Paginator :params="{ page: 1, size: 20, total: 2000 }" :cb="update" />
<Paginator type="infinite" :params="paginator" :cb="addData">
  <div class="infinite-container"><ul><li v-for="u in users" :key="u">{{ u }}</li></ul></div>
</Paginator>
```
