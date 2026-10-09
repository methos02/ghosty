---
paths:
  - "src/views/**"
  - "src/constants/**/*.js"
---
# Views Folder Holds Only Vue Components

`src/views/` contains only `.vue` files. Vue-dependent JS (provide/inject keys, shared view state) goes in `src/apis/{domain}/composables/`, with the `Symbol` key private to the file and exposed through small functions. `src/constants/` holds only framework-agnostic constants.

```js
// BAD - src/views/notifications/notification-detail-toggle.js
export const NOTIFICATION_DETAIL_TOGGLE_KEY = Symbol('notification-detail-toggle')

// GOOD - src/apis/notifications/composables/use-inline-notification-details.js
const INLINE_NOTIFICATION_DETAILS_KEY = Symbol('inline-notification-details')
export const useInlineNotificationDetails = () => provide(INLINE_NOTIFICATION_DETAILS_KEY, true)
export const useHasInlineNotificationDetails = () => inject(INLINE_NOTIFICATION_DETAILS_KEY, false)
```
