---
paths:
  - "backend/app/Services/**/*.php"
  - "backend/app/Repositories/**/*.php"
  - "backend/database/factories/**/*.php"
  - "backend/database/seeders/**/*.php"
---
# Maintain Invariant At Source

A denormalized value (`novels.main_branch_last_chapter_id`, counters such as `chapter_count`, `continuations_count`, `like_count`) MUST be updated by every event that could invalidate it (publication, deletion, moderation, like). Reads MUST NOT compute a silent fallback, and Resources read the column directly (no `withCount`).

- The mutating service updates it through a repository method (`$this->novelsR->incrementChapterCount(...)`, see `ChapterService::registerPublication`). Repositories may expose `increment{Column}` (@see global/method-naming.md).
- Factories and seeders go through the same service, so tests reflect real behaviour.
- @see decisions/ADR-03-compteur-denormalise-chapter-count.md

```php
// BAD - fallback computed at read time
return $this->storedLastChapter($novelId) ?? $this->mostLikedLastChapter($novelId);

// GOOD - kept valid where it changes, read as is
$this->novelsR->setLastChapterOfMainBranch($chapter->novel_id, $chapter->id);
return $this->chaptersR->lastChapterOfMainBranch($novelId);
```
