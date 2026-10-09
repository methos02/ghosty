---
paths:
  - "backend/app/**/*.php"
  - "backend/tests/**/*.php"
---
# Explicit Method Names

A repository or service method names the entity it handles and its criterion. No implicit pronoun (`For`, `Of`, `idOf`), no metaphor (`elected`, `strongest`, `withdraw`, `carries`): use the literal term. Variables follow the same rule. Stay short.

```php
// BAD
$this->likesR->idOf($userId, $chapter);
$this->notificationsR->paginateFor($recipient, $perPage);
$this->chaptersR->electedBranchEnd($novelId);

// GOOD
$this->likesR->findUserLikeId($userId, $chapter);
$this->notificationsR->paginateRecipientNotifications($recipient, $perPage);
$this->chaptersR->lastChapterOfMainBranch($novelId);
```
