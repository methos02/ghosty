---
paths:
  - "backend/app/**/*.php"
  - "backend/tests/**/*.php"
---
# Query Chain One Call Per Line

MUST break a database query chain (Eloquent or query builder) one method call per line as soon as a call follows the starting point (`Model::query()`, `Model::whereKey()`, a builder-returning method). Pint keeps a hand-broken chain broken but never breaks an inline one, so it is a project convention.

- A nested subquery passed as an argument breaks the same way, with the arguments of the outer call on their own lines.
- A chain inside a control-flow condition (`while`, `if`) moves to a named predicate method.
- Out of scope: model factories in tests (`Chapter::factory()->draft()->create()`) and non-query chains (`$request->string('search')->trim()->toString()`).
- Route declarations do the opposite: MUST stay on a single line, `->middleware()` and `->name()` included, so `routes/*.php` reads as a table, one route per line.

```php
// BAD
Notification::query()->whereKey($notification->id)->delete();

// GOOD
Notification::query()
    ->whereKey($notification->id)
    ->delete();

// BAD
->whereIn('id', Follow::query()->select('user_id')->whereIn('chapter_id', $chapterIds))

// GOOD
->whereIn(
    'id',
    Follow::query()
        ->select('user_id')
        ->whereIn('chapter_id', $chapterIds)
)
```
