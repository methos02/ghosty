---
paths:
  - "backend/app/Repositories/**/*.php"
---
# Repository Rules

Repositories are the **only** place for database access (query builder, Eloquent, `with`, `paginate`, `firstOrFail`, filters).

- One repository per entity: `App\Repositories\{Entity}Repository`.
- A repository **never depends on `Request`**. The controller extracts the params and passes typed arguments (or a filters array).
- Return models / collections / paginators — no HTTP concerns.

```php
// GOOD
class NovelRepository
{
    public function findBySlugWithRelations(string $slug): Novel
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
