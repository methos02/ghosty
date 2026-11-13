---
paths:
  - "src/**/*.js"
---
# JS File Structure

## Order

Each group of functions is declared **immediately above its own export object**: public functions above the public export, internals above the `internals` export. Functions and export properties are sorted **alphabetically** within each group. The public export follows the file's domain (`dateHelper`); the internal export is always named `internals`, the file already says whose internals they are. A test importing the internals of two modules aliases them (`import { internals as dateInternals }`).

## Call through the export object

MUST call a function of the same module through its export object (`ChapterDto.fromShow(chapter)`), never by its local name: every call reads the same, and a test spy on the export object fires (a direct call captures the local binding and bypasses `vi.spyOn`).

- A public function is called through the public object (`ChapterDto`).
- A non-public function that a test must spy goes in the `internals` export and is called through it.
- `internals` MUST NOT be imported outside its own module, except by a test. A caller needing one of these functions gets it from the public API: make the function public, never reach into `internals`.
- A non-public function no test needs to spy stays a plain local function, not exported, called directly.

```js
// GOOD
const fromList = notifications => notifications.map(notification => NotificationDto.fromNotification(notification))

const fromNotification = notification => ({
  id: notification.id,
  payload: internals.mapPayload(notification),
})

export const NotificationDto = { fromList, fromNotification }

const mapPayload = notification => LikeReceivedDto.fromNotification(notification)

export const internals = { mapPayload }

// GOOD
const sanitize = text => text.trim()
const uppercase = text => wordHelper.sanitize(text).toUpperCase()
export const wordHelper = { sanitize, uppercase }

// BAD
const fromList = notifications => notifications.map(notification => fromNotification(notification))

// BAD
export const wordHelper = { sanitize, uppercase }
export const internals = { sanitize }
```

A file that does not follow this structure is brought into conformance when touched ([boy-scout-cleanup-on-touch](../../global/boy-scout-cleanup-on-touch.md)).
