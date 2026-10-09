---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Naming

A name states what the thing is or does, honestly and completely. Booleans keep their `is/has/should/can` prefix (`unicorn/consistent-boolean-name`). Identifier language: [english-identifiers-french-labels](english-identifiers-french-labels.md).

## Role over origin

MUST name a variable, ref, param or function after its **intrinsic role** (the effect it controls), never after the incidental context that sets it today (the trigger, the caller). An incidental name lies as soon as a second trigger appears. Confine the context to the single line that decides it.

```js
// BAD
const isFromBell = route.query.source === 'bell'
const markReadFromBell = () => { ... }
dialog.show({ fromBell: isFromBell })

// GOOD
const shouldMarkRead = route.query.source === 'bell'
const markRead = () => { ... }
dialog.show(shouldMarkRead)
```

A reusable helper's params are named after their role inside the function, not after the only current caller. The source-specific name stays at the call site that composes sources.

```js
// BAD
const buildReadResult = (notificationId, bellErrors) => { ... }

// GOOD
const buildReadResult = (notificationId, errors) => { ... }
buildReadResult(notificationId, [...bellErrors, ...pageErrors])
```

- MUST prefer the word a domain reader recognizes over the algorithmic term of art (`lastChapters`, not `leaves`).
- MUST check the name covers everything the thing does: `notification-route-helper.js` that also formats dates lies as the file grows.
- MUST NOT give a derived value (clamped, reprojected, formatted) the bare name of the domain field. Suffix the transformation: `startForDisplay`, not `start`.

## Honest names

- MUST NOT use filler affixes: `Entry`, `Item`, `Base` without a role, `Of`, `For`, `Data`, `History`, nor a metaphor to decode. Keep 2-4 words: a longer name means the function does too much.
- MUST NOT end a name with a dangling preposition (`After`, `Before`, `With`, `From`, `Until`): anchor it or drop it.
- MUST NOT restate in the name the operands already in the signature.
- A function named after an entity takes that entity, not its exploded fields.
- When behaviour changes, MUST rename in the same change: a stale name is as misleading as a stale comment. Applies to DTO `to{Action}` and `get*` queries.

```js
// BAD
NotificationEntry.vue
const detailsOf = data => { ... }
const getChaptersAfter = (novelId, cutoffDate) => { ... }
const isNotificationMatchingFilter = (notification, filter) => { ... }
const readingTimeOfChapter = wordCount => { ... }
const toUnreadParams = page => ({ page })

// GOOD
NotificationByType.vue
const mapPayload = data => { ... }
const getChaptersAfterDate = (novelId, date) => { ... }
const matches = (notification, filter) => { ... }
const estimateReadingTime = chapter => { ... }
const toListParams = page => ({ page })
```

## Explicit identifiers

MUST use full, domain-specific names: no abbreviation, no generic name, no bare single letter (even to tell two instances apart).

| Avoid | Use |
|-------|-----|
| `e` | `event` |
| `i`, `x` | `index` |
| `el` | `element` |
| `err`, `res`, `req` | `error`, `response`, `request` |
| `item`, `element`, `data` (as a variable) | domain name: `novel`, `chapter`, `user` |
| `store` (bare) | domain-prefixed: `formStore`, `authStore` |

```js
// BAD
chapters.map(x => x.id)
const a = useNotificationStore()
const b = useNotificationStore()

// GOOD
chapters.map(chapter => chapter.id)
const bellStore = useNotificationStore()
const pageStore = useNotificationStore()
```

## Files and components

- Inside `apis/{domain}/`, every file starts with the singular domain, then the role: `novel-search-store.js`, not `search-novels-store.js`.
- Before naming a component, grep the word in the domain: if it already means something else there (`end` of a branch), pick another. A layout block takes layout vocabulary (`Footer`, `Toolbar`, `Panel`). Renaming a component renames its file, its test file and its BEM block together.

```
// BAD
ChapterEnd.vue

// GOOD
ChapterFooter.vue
```
