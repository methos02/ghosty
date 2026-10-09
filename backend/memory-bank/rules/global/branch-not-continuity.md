---
paths:
  - "backend/app/**/*.php"
  - "backend/database/**/*"
  - "backend/tests/**/*.php"
---
# Branch Not Continuity

The path of chapters from a root to a chapter is a **branch**; the most supported one is the **main branch**, never "current branch". Its last chapter is the "last chapter of main branch" (column `novels.main_branch_last_chapter_id`), never "end". Never name it "continuity" in identifiers, enum values, stored data or test names. Existing `@see` pointers to the ADR-08 file are exempt.

```php
// BAD
NotificationType::CurrentContinuityGained
$this->chaptersR->currentBranchEnd($novelId);

// GOOD
NotificationType::MainBranchGained
$this->chaptersR->lastChapterOfMainBranch($novelId);
```
