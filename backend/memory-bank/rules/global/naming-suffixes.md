---
paths:
  - "backend/app/**/*.php"
  - "backend/tests/**/*.php"
---
# Naming Suffixes

## Class suffix announces the folder

MUST give a class the suffix of its folder. When adding a class to a folder, rename the siblings that lack it in the same change.

| Folder (`app/`) | Suffix |
|---|---|
| `Http/Controllers/**` | `Controller` |
| `Http/Requests` | `Request` |
| `Http/Resources` | `Resource` |
| `Services` | `Service` |
| `Repositories` | `Repository` |
| `Policies` | `Policy` |
| `DTO` | `DTO` |
| `Support` | `Support` |
| `Console/Commands` | `Command` |
| `Providers` | `ServiceProvider` |

No suffix: `Models`, `Enums`, `Rules` (named after the constraint, `LimitedTextChange`), `Models/Concerns` traits (`HasSlug`, `Reportable`), `Exceptions`.

Tests append `Test` to the class name (`CoverUrlSupportTest`); file layout in `tests/test-structure.md`.

## Injected dependency name

- Repository: MUST be `{entities}R` (`$chaptersR`, `$novelsR`, `$likesR`).
- Any other class (service, support): MUST be the lowerCamelCase class name (`$chapterService`, `$notificationService`, `$likeAuthorizationService`).
- A bare name (`$novels`, `$genre`) is reserved for data (model, collection, query result).

```php
// GOOD
public function __construct(
    private readonly NovelRepository $novelsR,
    private readonly ChapterService $chapterService
) {}

// BAD - reads like data
private readonly NovelRepository $novels
```
