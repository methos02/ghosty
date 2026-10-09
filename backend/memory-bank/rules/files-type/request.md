---
paths:
  - "backend/app/Http/Requests/**/*.php"
  - "backend/app/Http/Controllers/**/*.php"
---
# Request Rules

A request carrying two resources namespaces them by nesting (`novel.title`, `chapter.title`). Never prefix a resource's own field names on its own endpoint (`chapter_title`): the write shape must keep matching the read shape of its Resource, and every client of the endpoint would pay for one screen's layout.

The controller stays an orchestrator: it hands each block to its own service. No duplicate DTO factory per entry point (`fromOrigin()`-style).

**BAD**

```php
'title' => ['required', 'string'],
'chapter_title' => ['required', 'string'],
```

**GOOD**

```php
'novel.title' => ['required', 'string'],
'chapter.title' => ['required', 'string'],
```
