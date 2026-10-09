---
paths:
  - "backend/app/Services/**/*.php"
---
# No Closure Parameter In Service Methods

A service method never takes a closure to run "in the middle" (snapshot before, run, snapshot after). The caller chains the steps explicitly and passes plain values. Closures stay fine for framework callbacks (transactions, collections, `updateOrCreate` data builders).

```php
// BAD
$this->notificationService->watchCurrentBranch($novelId, null, fn () => $this->recomputeBranchLikeCounts($novel));

// GOOD
$previousLastChapter = $this->chaptersR->lastChapterOfMainBranch($novel->id);
$this->recomputeBranchLikeCounts($novel);
$newLastChapter = $this->updateLastChapterOfMainBranch($novel);
$this->notificationService->mainBranchSwitch($previousLastChapter, $newLastChapter);
```
