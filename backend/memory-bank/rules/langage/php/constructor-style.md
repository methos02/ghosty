---
paths:
  - "backend/app/**/*.php"
---
# Constructor Style

Write constructors **multi-line, one promoted parameter per line** — even for a single parameter. Not enforced by Pint; a project convention (scales without reformatting when a dependency is added).

```php
// GOOD
public function __construct(
    private readonly NovelRepository $novelsR
) {}

// BAD
public function __construct(private readonly NovelRepository $novelsR) {}
```
