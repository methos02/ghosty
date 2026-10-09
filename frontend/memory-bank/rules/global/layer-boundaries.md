---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Layer Boundaries

## Core vs core-vue

`src/core/**` is pure JS (helpers): it MUST NOT import Vue. `src/core-vue/**` is Vue-dependent (composables) and may. Vue-free helpers live in `src/core/helpers/`, not in a `src/helpers/` folder.

## Domain layer: pure JS, no store

Controllers, repositories, DTOs and domain services (`src/apis/{domain}/**`) MUST NOT import Vue nor a store. Stores use `ref` / `readonly`; the domain layer stays framework-agnostic and portable.

Dependency direction:

```
.vue / composable -> Controller / Service -> Repository / DTO
.vue / composable -> Store
```

- A store is a leaf: a controller, service, repository or DTO MUST NOT import it, and a store MUST NOT call a controller or `req()` ([store-data-only](../files-type/store-data-only.md)).
- A composable or a component orchestrates controller and stores.

```js
// GOOD
const response = await NotificationController.list(page)
notificationStore.addNotifications(response.notifications)

// BAD
import { useNotificationStore } from '@/apis/notifications/stores/notification-store.js'
```

**Vuemann infrastructure services** (`src/services/**`: `ajax`, `form`, `auth`, `locale`, `flash`, `router`, `utils`) are not domain services. They own their runtime state, so their internal files MAY read their own store (`auth-functions.js` reads `auth-store.js`) or another service's store through `services-shortcut.js`.

## Logic in JS, not in `.vue`

A `.vue` file holds the template, event handlers that delegate to controllers/stores (including reading stores, calling a controller and raising flashes) and minimal reactive UI state. Business logic goes to `.js` (controller, store, service). A handler that reads a store is not by itself a reason to extract a composable ([composable](../files-type/composable.md)).

```js
// BAD
const novels = response.data.novels.filter(novel => !novel.is_hidden).map(novel => ({ ...novel, title: novel.nov_title }))

// GOOD
const { novels } = await NovelController.list({ page })
```
