---
paths:
  - "backend/app/**/*.php"
---
# Dependency Naming

An injected dependency carries a one-letter suffix indicating its kind: **`R` for a repository** (`$novelsR`, `$genresR`), **`H` for a helper** (`$xxxH`). The **bare name** (`$novels`, `$genre`) is reserved for **data** (model, collection, query result).

```php
// GOOD
public function __construct(
    private readonly NovelRepository $novelsR
) {}

$novels = $this->novelsR->paginateWithRelations();

// BAD - reads like data, not a repository
private readonly NovelRepository $novels
```
