---
paths:
  - "src/views/**"
  - "src/constants/**/*.js"
---
# Views Vue Only

`src/views/` MUST contain only `.vue` files. Vue-dependent JS (provide/inject keys, shared view state) goes in `src/apis/{domain}/composables/`, with the `Symbol` key private to the file and exposed through small functions (a provide/inject helper is the exception to the store export shape, see [composable-store-export-pattern](../files-type/composable-store-export-pattern.md)). `src/constants/` holds only framework-agnostic constants.

```js
// BAD
export const NOTIFICATION_DETAIL_TOGGLE_KEY = Symbol('notification-detail-toggle')

// GOOD
const INLINE_NOTIFICATION_DETAILS_KEY = Symbol('inline-notification-details')
export const useInlineNotificationDetails = () => provide(INLINE_NOTIFICATION_DETAILS_KEY, true)
export const useHasInlineNotificationDetails = () => inject(INLINE_NOTIFICATION_DETAILS_KEY, false)
```
