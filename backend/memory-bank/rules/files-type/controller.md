---
paths:
  - "backend/app/Http/Controllers/**/*.php"
  - "backend/routes/api.php"
---
# Controller Rules

Controllers orchestrate only: no DB access, no business logic.

- MUST NOT query in a controller. All DB access goes through a repository (@see files-type/repository.md): no `Model::`, query builder, `with`, `load`, `paginate` or `firstOrFail`.
- MUST inject dependencies (repositories, services) through the constructor (@see global/naming-suffixes.md).
- MUST inline a single-use private method whose name only repeats its body. Keep the extraction when it carries a real algorithm whose detail would hinder reading the action.
- MUST store the repository result in a named variable, then pass it to the Resource.

## Route models come bound

A model named in the URL (`{chapter}`, `{comment}`, `{novel}`) arrives in the action through Laravel's native route model binding (light model, 404 when unknown; a `HasSlug` model binds by its slug). MUST type the parameter with the model and name it like the route segment (`Chapter $chapter`). MUST NOT take an id or a slug and look the model up again in the action.

When the action serializes more than the light model (relations, reader flags such as `is_liked`), MUST reload through a repository method into a variable named after what it adds (`$chapterForReader`, `$chapterWithContext`).

**BAD**

```php
public function show(string $slug): NovelResource
{
    $novel = $this->novelsR->findBySlug($slug);

    return new NovelResource($novel);
}
```

**GOOD**

```php
public function show(Novel $novel): NovelResource
{
    return new NovelResource($novel);
}

public function show(Chapter $chapter): ChapterResource
{
    $chapterForReader = $this->chaptersR->find($chapter->id, $this->currentUserHelper->id());

    return new ChapterResource($chapterForReader);
}
```
