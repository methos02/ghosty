---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Passthrough Layers

A layer that only delegates, without transforming, validating or orchestrating two or more dependencies, adds nothing. MUST remove it and consume the underlying layer directly.

Red flags:
1. **Composable or context wrapping a singleton store** and a single controller call: siblings import the store and call the controller directly.
2. **Service wrapping a single controller**: a service orchestrates at least two ([service](../files-type/service.md)).
3. **Single-consumer composable**: inline each function in its sole consumer and delete the file.
4. **Duplicated validation**: a `hasActiveFilters()` or `canSearch` computed re-checking fields the form request already covers. The form request is the single source of truth.

```js
// BAD
const searchByFilters = async filters => {
  if (!hasActiveFilters(filters)) {
    return { success: false }
  }
  const response = await NovelController.list(filters)
  return { success: ajaxHelper.isSuccess(response.status), data: response.data }
}
export const NovelService = { searchByFilters }

// GOOD
const handleSearch = async () => {
  const validation = validateNovelForm(formData.value)
  if (!validation.valid) {
    return
  }
  const response = await NovelController.list(formData.value)
  novelStore.addNovels(ajaxHelper.isSuccess(response.status) ? response.data : [])
}
```

A layer is justified by: a real transformation (mapping, aggregation, calculation); orchestration of two or more dependencies; page-local state that must not survive unmount; a mock injection point for integration tests of the component graph.
