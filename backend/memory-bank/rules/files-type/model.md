---
paths:
  - "backend/app/Models/**/*.php"
---
# Model Rules

## Reusable behavior → trait in `Concerns/`

Cross-model behavior (slug generation, etc.) lives in a trait under `app/Models/Concerns/`, not inline in the model body. Expose an overridable config hook (e.g. `slugSource()`); the model just does `use TheTrait`. Prefer a native trait over an external package for a simple, single-model need (@see decisions/ADR-02-slug-natif-sans-package.md).

```php
// GOOD
class Novel extends Model
{
    use HasSlug; // App\Models\Concerns\HasSlug — creating hook + uniqueness
}

// BAD - slug/uniqueness logic written inline in the model body
```

## Denormalized counters must be maintained

A denormalized counter column (`chapter_count`, and future `vote_count` / `comment_count` / `favorites_count`) is read directly by the Resource (no `withCount`). Its value **must** be kept in sync **centrally** — in a model observer or the service that mutates the related records (`increment`/`decrement`) — never left to drift. (@see decisions/ADR-03-compteur-denormalise-chapter-count.md)
