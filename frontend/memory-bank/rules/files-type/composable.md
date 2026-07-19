---
paths:
  - "src/**/composables/**/*.js"
---
# Composable Rules

Use a composable (not a helper) when a view-oriented function depends on a store. Helpers are pure JS (`pure-js-no-vue-imports`) and cannot import stores. Keep state in the store; derived UI bindings in a composable.

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

A composable must NOT map raw API/service data into a view-model — API-field shaping belongs in a DTO called by the controller/service. But the composable DOES own **client lifecycle state** (loading status, counters, locally-edited lists): the DTO cannot provide it because it only maps fields the API actually returns (`dto.md`). So the composable consumes the DTO-mapped result and layers its own state on top.

```js
// BAD - composable maps raw API fields into a view-model (the DTO's job)
genres.value = response.data.map(genre => ({ id: genre.id, name: genre.gen_name, count: 0, status: 'idle' }))

// GOOD - DTO maps the API fields; composable adds the client state it owns
genres.value = ChangeReportDto.fromManagedGenres(response.data)
  .map(genre => ({ ...genre, count: 0, status: 'idle', changed: [], unchanged: [] }))
```
