---
paths:
  - "**/use-*.js"
  - "src/**/composables/**/*.js"
  - "src/**/stores/**/*.js"
---
# Composable Store Export Pattern

Applies to composables and **client-only** stores. A store rendered at SSR follows [request-scoped-store](request-scoped-store.md): the module-level refs below leak between visitors on the server.

- MUST return refs/computed at the top level of the composable or store.
- MUST group functions in a named object matching the store name (`useNotificationStore` -> `notificationStore`). The object contains only functions, never refs.
- MUST destructure the call. MUST NOT wrap it in `reactive()`: it unwraps the refs and hides the contract.
- A composable without refs still groups its functions in the named object.
- Exception: a provide/inject helper composable exposes the single function that provides or injects its key (`useHasInlineNotificationDetails`), see [views-vue-only](../global/views-vue-only.md).

```js
// GOOD
const notifications = ref([])
const unreadCount = ref(0)

const markAsRead = notificationId => { ... }
const clear = () => { ... }

export const useNotificationStore = () => ({
  notifications: readonly(notifications),
  unreadCount: readonly(unreadCount),
  notificationStore: {
    markAsRead,
    clear,
  },
})

const { notifications, notificationStore } = useNotificationStore()
notificationStore.markAsRead(notificationId)

// GOOD
export const useChapterReading = () => ({
  chapterReading: { load },
})

// BAD
export const useNotificationStore = () => ({ notifications, unreadCount, markAsRead, clear })

// BAD
export const useNotificationStore = () => ({
  notificationStore: { notifications, markAsRead },
})

// BAD
const notificationStore = reactive(useNotificationStore())
```
