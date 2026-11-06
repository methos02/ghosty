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

## No generic bag

A Resource MUST NOT serialize a generic JSON column (`data`, `payload`, ...) under a wrapper key: the client would read `notification.data.x`. Inline its scalar values at the top level of the returned array. Related entities (`novel`, `chapter`) keep their own key.

A key stored in the inlined column MUST NOT reuse the name of a field the Resource already exposes (`id`, `type`, `is_read`, `created_at`, `updated_at`): one of the two silently overwrites the other (the later key wins). Only the serialization is reshaped; the storage shape is unchanged.

**BAD**

```php
return [
    'id' => $this->id,
    'data' => $this->data,
];
```

**GOOD**

```php
return [
    'id' => $this->id,
    'novel' => $this->data['novel'],
    'chapter' => $this->data['chapter'] ?? null,
    ...array_diff_key($this->data, array_flip(['novel', 'chapter'])),
];
```
