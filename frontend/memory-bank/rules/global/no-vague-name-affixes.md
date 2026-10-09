---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Vague Name Affixes

A name states what the thing is or does, and for whom when needed. Banned affixes that say nothing: `Entry`, `Item`, `Base` without a role, `Of`, `For`, `Data`, `History` used as filler. No metaphor to decode. Keep it to 2–4 words: a longer name means the function does too much or the vocabulary is not fixed yet.

```js
// BAD
NotificationEntry.vue
const detailsOf = data => …
useNotificationHistory()

// GOOD
NotificationByType.vue
const mapPayload = data => …
useNotificationList()
```
