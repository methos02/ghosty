---
paths:
  - "backend/app/**/*.php"
---
# Constructor Style

MUST write constructors **multi-line, one promoted parameter per line** (even for a single parameter). Pint does not enforce it (verified), so it is a project convention.

```php
// GOOD
public function __construct(
    private readonly NovelRepository $novelsR
) {}

// BAD
public function __construct(private readonly NovelRepository $novelsR) {}
```
