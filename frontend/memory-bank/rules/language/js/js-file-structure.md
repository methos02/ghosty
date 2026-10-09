---
paths:
  - "src/**/*.js"
---
# JS File Structure

## Order

Each group of functions is declared **immediately above its own export object**: public functions above the public export, internals above the `Internal` export. Functions and export properties are sorted **alphabetically** within each group. Export names follow the file's domain (`dateHelper` / `dateHelperInternal`).

## Internal export: only when a test must spy

Call a same-module function **directly** by default. MUST expose it through an `xInternal` export and call it through that object only when a test must spy or mock it (`vi.spyOn`). A direct call captures the local binding: a spy on the export object never fires (verified with `vi.spyOn(modInternal, 'helperA')`: the direct caller still returns the real value).

- A public helper that a test must spy is called through the public object: no `Internal` export.
- A helper no test needs to spy stays a plain local function, not exported.

```js
// GOOD
const fromNotification = data => ({
  id: data.id,
  payload: NotificationDtoInternal.mapPayload(data),
})

export const NotificationDto = { fromNotification }

const mapPayload = data => LikeReceivedDto.fromNotification(data)

export const NotificationDtoInternal = { mapPayload }

// GOOD
const sanitize = text => text.trim()
const uppercase = text => wordHelper.sanitize(text).toUpperCase()
export const wordHelper = { sanitize, uppercase }

// BAD
export const wordHelper = { sanitize, uppercase }
export const wordHelperInternal = { sanitize }
```

A file that does not follow this structure is brought into conformance when touched ([boy-scout-cleanup-on-touch](../../global/boy-scout-cleanup-on-touch.md)).
