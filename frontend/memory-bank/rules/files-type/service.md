---
paths:
  - "src/apis/**/services/**/*.js"
---
# Service

A domain service (`src/apis/{domain}/services/`) orchestrates two or more controllers. It is not a Vuemann infrastructure service (`src/services/**`: `ajax`, `form`, `auth`, `locale`...), which follows [layer-boundaries](../global/layer-boundaries.md).

- MUST create a service when a flow needs 2+ controllers. A controller MUST NOT call another controller.
- MUST NOT create a service around a single controller ([no-passthrough-layers](../global/no-passthrough-layers.md)).

```
Component or composable -> Service -> Controller A
                                   -> Controller B
```

```js
// GOOD
const publishAndMarkRead = async (chapterId, notificationId) => {
  const published = await ChapterController.publish(chapterId)
  if (!ajaxHelper.isSuccess(published.status)) {
    return published
  }
  return await NotificationController.markAsRead(notificationId)
}

export const ChapterPublicationService = { publishAndMarkRead }

// BAD
import { NotificationController } from '@/apis/notifications/controllers/notification-controller.js'
```
