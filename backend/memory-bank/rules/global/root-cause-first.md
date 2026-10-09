---
paths:
  - "backend/app/**/*.php"
---
# Root Cause First

Fix the cause of a bug, never compensate its symptom with a patch (extra stored date, retry, special case). If the cause is a fragile comparison, replace the comparison.

```php
// BAD - second-precision dates compared across two tables, patched with a stored date
->where('created_at', '>=', $notification->data['since'])

// GOOD - monotonic cursor on the like id
->where('id', '>=', $firstLikeId)
```
