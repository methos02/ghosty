---
paths:
  - "src/**/*.js"
---
# JS File Structure

## Order

Each group of functions is declared **immediately above its own export object**: public functions above the public export, internals above the `Internal` export. Functions and export properties are sorted **alphabetically** within each group. Export names follow the file's domain (`dateHelper` / `dateHelperInternal`).

## Call through the export object

MUST call a function of the same module through its export object (`ChapterDto.fromShow(chapter)`), never by its local name: every call reads the same, and a test spy on the export object fires (a direct call captures the local binding and bypasses `vi.spyOn`).

- A public function is called through the public object (`ChapterDto`).
- A non-public function that a test must spy goes in the `xInternal` export and is called through it.
- A non-public function no test needs to spy stays a plain local function, not exported, called directly.

```js
// GOOD
const fromList = notifications => notifications.map(notification => NotificationDto.fromNotification(notification))

const fromNotification = notification => ({
  id: notification.id,
  payload: NotificationDtoInternal.mapPayload(notification),
})

export const NotificationDto = { fromList, fromNotification }

const mapPayload = notification => LikeReceivedDto.fromNotification(notification)

export const NotificationDtoInternal = { mapPayload }

// GOOD
const sanitize = text => text.trim()
const uppercase = text => wordHelper.sanitize(text).toUpperCase()
export const wordHelper = { sanitize, uppercase }

// BAD
const fromList = notifications => notifications.map(notification => fromNotification(notification))

// BAD
export const wordHelper = { sanitize, uppercase }
export const wordHelperInternal = { sanitize }
```

A file that does not follow this structure is brought into conformance when touched ([boy-scout-cleanup-on-touch](../../global/boy-scout-cleanup-on-touch.md)).
