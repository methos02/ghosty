---
paths:
  - "src/**/*.js"
---
# If Guards Over Lookup Object

To dispatch on a value (type, status), MUST write guard clauses `if (value === X) { return ... }`. MUST NOT index an object dynamically (`MAP[value]`, `{ [A]: fn }[value]`).

```js
// BAD
const TYPE_DTOS = { [TYPES.LIKE_RECEIVED]: LikeReceivedDto, [TYPES.CHAPTER_CONTINUED]: ChapterContinuedDto }
return TYPE_DTOS[data.type]?.fromNotification(data)

// GOOD
if (data.type === TYPES.LIKE_RECEIVED) {
  return LikeReceivedDto.fromNotification(data)
}

if (data.type === TYPES.CHAPTER_CONTINUED) {
  return ChapterContinuedDto.fromNotification(data)
}

return {}
```
