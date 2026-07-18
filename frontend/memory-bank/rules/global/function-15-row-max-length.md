---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Function Length: 15 Lines Max

Functions must not exceed 15 executable lines. Count only executable lines (not blanks/comments). Multi-line conditions/objects count as one logical line.

## Exceptions

| Context | Reason |
|---------|--------|
| Switch with many cases | Each case is simple, splitting reduces clarity |
| Object/array literals | Data definition, not logic |
| DTOs with many fields | Transformation mapping |

Refactoring strategies: extract `validateX()`, `calculateX()`, `transformX()`, `notifyX()`.

When an `if` block body contains more than one logical line (multiple assignments, object construction), extract it into a named internal function.

```js
// BAD — multi-line logic inlined in if
if (filters.availability?.status) {
    payload.availability_status = filters.availability.status
    payload.availability_start_date = filters.availability.startDate
    payload.availability_end_date = filters.availability.endDate
}

// GOOD — extracted to internal function
if (filters.availability?.status) {
    Object.assign(payload, ModuleInternal.buildAvailabilityPayload(filters.availability))
}
```
