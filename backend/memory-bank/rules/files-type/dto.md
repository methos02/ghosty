---
paths:
  - "backend/app/DTO/**/*.php"
  - "backend/app/Services/**/*.php"
  - "backend/app/Http/Controllers/**/*.php"
---
# DTO Rules

Transport objects live in `backend/app/DTO/` as `final readonly class {Entity}DTO`, named after the entity **without a verb** (`ChapterDTO`, not `ChapterWriteDTO`): the same DTO serves create, update and correction.

- MUST build a DTO with a named constructor `fromRequest(FormRequest $request)`. MUST NOT accept a bare `Illuminate\Http\Request`.
- A service takes a DTO, never `array $datas` plus a trailing boolean. MUST name the parameter after the DTO (`$chapterDTO`), not `$datas`.
- The DTO transforms **its own fields** through `attributes()`; the service composes the row (author, tree position, status, timestamps). A DTO needing the model, the clock or the authenticated user is no longer a DTO.
- A DTO knows the key it lives under in a nested payload: MUST NOT pass the key in. Toggle with `bool $addPrefix = false`, always called with the named argument.

**BAD**

```php
ChapterDTO::fromRequest($request, 'novel');
$this->chapterService->create($novel, $author, $datas, true);
```

**GOOD**

```php
ChapterDTO::fromRequest($request, addPrefix: true);
$this->chapterService->create($novel, $author, $chapterDTO);
```
