---
paths:
  - "src/**/*.vue"
---
# JS Logic in JS Files

Keep business logic in `.js` files (controllers, stores, services). `.vue` files contain only: template rendering, event handlers that delegate to controllers/stores, and minimal reactive UI state.

```js
// BAD - logic in component
const deletePromises = ids.map(id => Controller.destroy(id))
const results = await Promise.all(deletePromises)
const hasError = results.some(result => result.status !== STATUS.SUCCESS)

// GOOD - delegate to controller
const result = await NovelChapterController.destroys(ids)
```
