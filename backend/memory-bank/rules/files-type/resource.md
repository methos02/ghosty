---
paths:
  - "backend/app/Http/Resources/**/*.php"
---
# Resource Rules

A Resource never inspects the HTTP request (`routeIs(...)`) to decide what it serializes. The rich case is the base class; the lightweight case is an explicit subclass (`ChapterListResource extends ChapterResource`) chosen **at the call site**. The default is "expose": an oversight costs measurable bandwidth, not a silently missing field.

A computed field is not spared its computation by an `unset()` afterwards: override a protected method that does not produce it.

**BAD**

```php
if (! $request->routeIs('chapters.show', 'chapters.store')) {
    unset($attributes['content']);
}
```

**GOOD**

```php
return ChapterListResource::collection($chapters);
```
