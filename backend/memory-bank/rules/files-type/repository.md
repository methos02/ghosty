---
paths:
  - "backend/app/Repositories/**/*.php"
---
# Repository Rules

Repositories are the **only** place for database access (query builder, Eloquent, `with`, `paginate`, `firstOrFail`, filters).

- One repository per entity: `App\Repositories\{Entity}Repository`.
- A repository **never depends on `Request`**. The controller extracts the params and passes typed arguments (or a filters array).
- Return models / collections / paginators — no HTTP concerns.
- **Queries only.** A purely in-memory transformation of an already-loaded collection (grouping, ordering a chain) leaves the repository: it goes in a static class under `App\Support`, testable without a database. Not in a DTO (DTOs are `readonly` objects built from a `Request`).

```php
// GOOD
class NovelRepository
{
    public function findBySlug(string $slug): Novel
    {
        return Novel::with(['genre', 'author'])->where('slug', $slug)->firstOrFail();
    }
}

// BAD - repository coupled to HTTP
public function filter(Request $request): Collection
{
    return Work::where('type', $request->integer('type'))->get();
}
```
