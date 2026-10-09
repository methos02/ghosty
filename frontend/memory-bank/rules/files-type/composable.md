---
paths:
  - "src/**/composables/**/*.js"
---
# Composable Rules

A composable is justified by exactly two situations: the same logic is consumed by two or more components, or the component is too large to keep whole and its template must be split (the logic would otherwise be duplicated across the pieces). Otherwise the logic stays in the `.vue` next to its template, even when it reads stores, calls a controller and raises flashes: depending on a store is not a reason to extract.

When a composable is justified: use it (not a helper) for a view-oriented function that depends on a store. Helpers are pure JS (`pure-js-no-vue-imports`) and cannot import stores. Keep state in the store; derived UI bindings and orchestration of several stores plus a controller in the composable (`apis/{domain}/composables/use-*.js`).

```js
// BAD - helper importing a store (violates pure-js-no-vue-imports)
// src/core/helpers/color-helper.js
import { colorStore } from '@/core-vue/stores/color-store.js'
export const colorHelper = {
  getStyles: (id) => ({ swatch: { backgroundColor: colorStore.get(id)?.hex } })
}

// BAD - UI-specific shape leaking into the store
// src/core-vue/stores/color-store.js
const getStyles = (id) => ({
  text: { color: get(id)?.hex },
  swatch: { backgroundColor: get(id)?.hex }
})

// GOOD - composable owns the mapping, store stays pure state
// src/core-vue/composables/color/use-color-styles.js
import { colorStore } from '@/core-vue/stores/color-store.js'

const getStyles = (id) => {
  const hex = colorStore.get(id)?.hex
  return { hex, text: { color: hex }, swatch: { backgroundColor: hex } }
}

export const useColorStyles = () => ({ getStyles })
```

## Shape API data in the DTO; initialize client state in the composable

A composable must NOT map raw API/service data into a view-model — API-field shaping belongs in a DTO called by the controller/service. But the composable DOES own **client lifecycle state** of the data it loads (loading status, counters, locally-edited lists); the state of an interaction a component triggers stays in that component (`store-data-only.md`): the DTO cannot provide it because it only maps fields the API actually returns (`dto.md`). So the composable consumes the DTO-mapped result and layers its own state on top.

```js
// BAD - composable maps raw API fields into a view-model (the DTO's job)
genres.value = response.data.map(genre => ({ id: genre.id, name: genre.gen_name, count: 0, status: 'idle' }))

// GOOD - DTO maps the API fields; composable adds the client state it owns
genres.value = ChangeReportDto.fromManagedGenres(response.data)
  .map(genre => ({ ...genre, count: 0, status: 'idle', changed: [], unchanged: [] }))
```
