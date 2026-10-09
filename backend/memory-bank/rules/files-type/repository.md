---
paths:
  - "backend/app/Repositories/**/*.php"
---
# Repository Rules

Repositories are the **only** place for database access (query builder, Eloquent, `with`, `paginate`, `firstOrFail`, filters, `increment`).

- MUST have one repository per entity: `App\Repositories\{Entity}Repository`.
- MUST NOT depend on `Request` or `FormRequest`. The controller extracts the params and passes typed arguments or a filter DTO.
- MUST return models / collections / paginators, no HTTP concerns.
- Queries only. A purely in-memory transformation of an already-loaded collection (grouping, ordering a chain) leaves the repository and goes in a static class under `App\Support`, testable without a database. Not in a DTO.

**BAD**

```php
public function filter(Request $request): Collection
{
    return Chapter::where('status', $request->integer('status'))->get();
}
```

**GOOD**

```php
public function findBySlug(string $slug): Novel
{
    return Novel::with(['genre', 'author'])->where('slug', $slug)->firstOrFail();
}
```
