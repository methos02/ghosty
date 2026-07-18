---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Name Derived Values Explicitly

A value derived from a domain field — clamped, reprojected, formatted — must not wear that field's bare name; suffix the transformation into it instead. A generic `start` / `end` / `price` on an intermediate object invites the reader to trust it as the validated domain value, and to dismiss the guards that exist only because it is not.

```js
// BAD - two different meanings, one name; the guard below reads as redundant
// with form validation, when it actually filters occupations outside the window
block.start = clampToWindow(occupation.start)
if (block.start < block.end) { ... }

// GOOD - the name carries the transformation, the guard makes sense
block.startForPlanning = clampToWindow(occupation.startInMinutes)
if (block.startForPlanning < block.endForPlanning) { ... }
```

The tell: a reviewer calls a guard redundant because the name hides that the value was reprojected.
