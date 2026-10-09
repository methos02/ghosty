---
paths:
  - "backend/app/Services/**/*.php"
  - "backend/app/Repositories/**/*.php"
  - "backend/database/factories/**/*.php"
  - "backend/database/seeders/**/*.php"
---
# Maintain Invariants At The Source

A denormalized value (e.g. `novels.main_branch_last_chapter_id`) is updated by every event that could invalidate it (root publication, deletion, moderation). Reads never compute a silent fallback. Factories and seeders apply the same rule through the service, so tests reflect real behaviour.

```php
// BAD - fallback computed at read time
return $this->storedLastChapter($novelId) ?? $this->mostLikedLastChapter($novelId);

// GOOD - kept valid where it changes, read as is
$this->novelsR->setLastChapterOfMainBranch($chapter->novel_id, $chapter->id);
$this->trimMainBranchAt($chapter);
return $this->chaptersR->lastChapterOfMainBranch($novelId);
```
