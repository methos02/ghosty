---
paths:
  - "backend/app/**/*.php"
---
# No Unreachable Expression

An expression no reachable path can exercise is noise that misleads about the domain, not documentation. Remove it. If the case becomes reachable, reintroduce it together with the test that covers it.

**BAD**

```php
'branch_like_count' => $parent->branch_like_count + $chapter->like_count,
```

**GOOD**

```php
'branch_like_count' => $parent->branch_like_count,
```
