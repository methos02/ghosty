---
paths:
  - "backend/app/Http/Controllers/**/*.php"
---
# Controller Rules

Controllers orchestrate only — no DB access, no business logic.

- **No queries in a controller.** All DB access goes through a repository (@see files-type/repository.md). Never call `Model::`, the query builder, `with`, `paginate` or `firstOrFail` from a controller.
- **Inject dependencies** (repositories, helpers) via the constructor (autowired by the container).
- **Intermediate variable before a Resource.** Store the repository result in a named variable, then pass it to the Resource — do not inline the call.

```php
// GOOD
public function __construct(
    private readonly NovelRepository $novelsR
) {}

public function show(string $slug): NovelResource
{
    $novel = $this->novelsR->findBySlugWithRelations($slug);

    return new NovelResource($novel);
}

// BAD - query in the controller, inlined in the Resource
public function show(string $slug): NovelResource
{
    return new NovelResource(Novel::with('genre')->where('slug', $slug)->firstOrFail());
}
```
