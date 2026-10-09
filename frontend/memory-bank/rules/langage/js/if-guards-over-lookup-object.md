---
paths:
  - "src/**/*.js"
---
# If Guards Over Lookup Objects

To dispatch on a value (type, status), write guard clauses `if (value === X) { return … }`. Never an object indexed dynamically (`MAP[value]`, `{ [A]: fn }[value]`).

```js
// BAD
const TYPE_DTOS = { [TYPES.LIKE]: LikeDto, [TYPES.CONTINUED]: ContinuedDto }
return TYPE_DTOS[data.type]?.fromNotification(data)

// GOOD
if (data.type === TYPES.LIKE) {
  return LikeDto.fromNotification(data)
}

if (data.type === TYPES.CONTINUED) {
  return ContinuedDto.fromNotification(data)
}

return {}
```
