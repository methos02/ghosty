---
paths:
  - "backend/app/Http/Controllers/**/*.php"
---
# Controller Rules

Controllers orchestrate only: no DB access, no business logic.

- MUST NOT query in a controller. All DB access goes through a repository (@see files-type/repository.md): no `Model::`, query builder, `with`, `paginate` or `firstOrFail`.
- MUST inject dependencies (repositories, services) through the constructor (@see global/naming-suffixes.md).
- MUST inline a single-use private method whose name only repeats its body. Keep the extraction when it carries a real algorithm whose detail would hinder reading the action.
- MUST store the repository result in a named variable, then pass it to the Resource.

**BAD**

```php
public function show(string $slug): NovelResource
{
    return new NovelResource(Novel::with('genre')->where('slug', $slug)->firstOrFail());
}
```

**GOOD**

```php
public function show(string $slug): NovelResource
{
    $novel = $this->novelsR->findBySlug($slug);

    return new NovelResource($novel);
}
```
