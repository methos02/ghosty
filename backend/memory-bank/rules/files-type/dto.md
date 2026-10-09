---
paths:
  - "backend/app/DTO/**/*.php"
  - "backend/app/Services/**/*.php"
  - "backend/app/Http/Controllers/**/*.php"
---
# DTO Rules

Transport objects live in `backend/app/DTO/` as `final readonly class {Entity}DTO`, named after the entity **without a verb** (`ChapterDTO`, not `ChapterWriteDTO`): the same DTO serves create, update and correction. Services take a DTO, never `array $datas` plus a trailing boolean.

- Named constructor `fromRequest(FormRequest $request)`.
- Boundary: the DTO transforms **its own fields** through `attributes()`; the service composes the row (author, tree position, status, timestamps). A DTO needing the model, the clock or the authenticated user is no longer a DTO.
- A DTO knows the key it lives under in a nested payload: never pass the key in. Toggle with `bool $addPrefix = false`, always called with the named argument. No key-building closure inside the factory.

**BAD**

```php
ChapterDTO::fromRequest($request, 'novel');
$this->chapterService->create($parent, $author, $datas, true);
```

**GOOD**

```php
ChapterDTO::fromRequest($request, addPrefix: true);
$this->chapterService->create($parent, $author, $chapterDTO);
```
