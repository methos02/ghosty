---
paths:
  - "**/use-*.js"
  - "src/**/composables/**/*.js"
---
# Composable

A composable is justified by exactly two situations: the same logic is consumed by two or more components, or the component is too large to keep whole and its template must be split (the logic would otherwise be duplicated across the pieces). Otherwise the logic stays in the `.vue` next to its template, even when it reads stores, calls a controller and raises flashes: reading a store is not a reason to extract. Export shape: [composable-store-export-pattern](composable-store-export-pattern.md).

When justified, use a composable (not a helper) for a view-oriented function that depends on a store. Helpers are pure JS and cannot import stores ([layer-boundaries](../global/layer-boundaries.md)). The store keeps state; the composable owns derived UI bindings and the orchestration of several stores plus a controller (`apis/{domain}/composables/use-*.js`).

```js
// BAD
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'

// BAD
const getBadge = () => ({ label: unreadCount.value > 99 ? '99+' : String(unreadCount.value) })

// GOOD
export const useNotificationBadge = () => {
  const { unreadCount } = useNotificationStore()

  const label = computed(() => (unreadCount.value > 99 ? '99+' : String(unreadCount.value)))

  return { label }
}
```

## Client state in the composable, API shape in the DTO

A composable MUST NOT map raw API fields into a view-model: that is the DTO's job, called by the controller. The composable DOES own the **client lifecycle state** of the data it loads (loading status, locally-edited lists). The state of an interaction a component triggers stays in that component ([store-data-only](store-data-only.md)).

```js
// BAD
novels.value = response.data.map(novel => ({ id: novel.id, title: novel.nov_title, status: 'idle' }))

// GOOD
novels.value = NovelDto.fromList(response.data).map(novel => ({ ...novel, status: 'idle' }))
```
