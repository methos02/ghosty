---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
  - "src/**/*.json"
  - "tests/**/*.js"
---
# Branch Not Continuity

The path of chapters from a root to a chapter is a **branch**; the most supported one is the **main branch**, never "current branch". Its last chapter is `lastChapterOfMainBranch`, never "end".

MUST NOT use "continuity" / « continuité » in identifiers, translation keys, user-facing text or test names. "Continuation" (a chapter continuing another: `CHAPTER_CONTINUED`) is allowed.

```js
// BAD
NOTIFICATION_TYPES.CURRENT_CONTINUITY_GAINED
t('common.current_continuity')
isCurrentBranch

// GOOD
NOTIFICATION_TYPES.MAIN_BRANCH_GAINED
t('common.main_branch')
isMainBranch
```
