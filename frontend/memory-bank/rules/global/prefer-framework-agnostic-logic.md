---
paths:
  - "src/**/*.vue"
---
# JS Logic in JS Files

Keep business logic in `.js` files (controllers, stores, services). `.vue` files contain only: template rendering, event handlers that delegate to controllers/stores (including reading stores, calling a controller and raising flashes), and minimal reactive UI state. A handler that reads a store is not by itself a reason to extract a composable (see `files-type/composable.md`).

```js
// BAD - logic in component
const deletePromises = ids.map(id => Controller.destroy(id))
const results = await Promise.all(deletePromises)
const hasError = results.some(result => !ajaxHelper.isSuccess(result.status))

// GOOD - delegate to controller
const result = await NovelChapterController.destroys(ids)
```
