---
paths:
  - "backend/app/Services/**/*.php"
---
# No Closure Param In Service

A service method MUST NOT take a closure to run "in the middle" (snapshot before, run, snapshot after). The caller chains the steps explicitly and passes plain values. Closures remain allowed for framework callbacks (transactions, collections, `updateOrCreate` data builders).

```php
// BAD
$this->notificationService->watchMainBranch($novelId, fn () => $this->branchService->recomputeBranchLikes($novel));

// GOOD
$previousLastChapter = $this->chaptersR->lastChapterOfMainBranch($novel->id);
$this->branchService->recomputeBranchLikes($novel);
$newLastChapter = $this->branchService->updateLastChapterOfMainBranch($novel);
$this->notificationService->mainBranchSwitch($previousLastChapter, $newLastChapter);
```
