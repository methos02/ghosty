---
paths:
  - "backend/app/**/*.php"
  - "backend/database/**/*.php"
  - "backend/lang/**/*.php"
---
# Domain Vocabulary

## One word, one meaning

MUST grep the existing meaning of a domain word before using it in a new identifier. If the word is taken, rename the existing usage or pick another word.

MUST reuse the term the code already uses for a concept (`like`, not `support` / `vote` / `soutien`), even when an ADR or doc words it differently.

**BAD**

```php
$this->chaptersR->branchWithSupportedContinuations($chapter);
```

**GOOD**

```php
$this->chaptersR->branchWithUnlikedContinuations($chapter);
```

## Branch, not continuity

- The path of chapters from a root to a chapter is a **branch**; the most liked one is the **main branch**, never "current branch".
- Its last chapter is the "last chapter of main branch" (column `novels.main_branch_last_chapter_id`), never "end".
- MUST NOT use "continuity" (identifiers, enum values, stored data, test names) nor "continuité" (messages in `lang/fr/`). "Continuation" (a chapter following another) is allowed.
- Exempt: `@see` pointers to the ADR-08 file, whose name contains "continuite".

**BAD**

```php
NotificationType::CurrentContinuityGained
$this->chaptersR->currentBranchEnd($novelId);
```

**GOOD**

```php
NotificationType::MainBranchGained
$this->chaptersR->lastChapterOfMainBranch($novelId);
```
