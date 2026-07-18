---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Passthrough Layers

A layer that only delegates without transforming, validating, or orchestrating ≥2 dependencies adds no value. Remove it and consume the underlying layer directly.

## Red flags

1. **Composable/context wrapping a singleton store** — if `createXxxContext` + `provide/inject` only exposes a module-level store and wraps a controller call, sibling components must import the store and call the controller directly.
2. **Service wrapping a single controller** — "orchestrates multiple controllers" is strict: below two, there is nothing to orchestrate. No service; call the controller from the component.
3. **Duplicated validation** — a `service.hasActiveFilters()` or `computed canSearch` that re-checks fields already covered by the form request is duplication. The form request is the single source of truth.

```js
// BAD - single-controller service, duplicates form request validation
const searchByFilters = async (filters) => {
    if (!hasActiveFilters(filters)) { return { success: false } }
    const response = await NovelController.search(filters)
    return { success: response.status === STATUS.SUCCESS, data: response.data }
}
export const NovelService = { searchByFilters }

// GOOD - no service, logic directly in component
const handleSearch = async () => {
    const validation = searchFormRequest.validate(formData.value)
    if (!validation.valid) { return }
    const response = await NovelController.search(formData.value)
    novelStore.setAll(response.status === STATUS.SUCCESS ? response.data : [])
}
```

## When a layer is justified

- Real transformation (mapping, aggregation, calculation)
- Orchestration of ≥2 dependencies (≥2 controllers for a service, inter-component coordination for a composable)
- Page-local state that must not survive unmount (unlike a singleton)
- Mock injection for integration tests of the component graph
