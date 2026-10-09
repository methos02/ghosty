---
paths:
  - "backend/app/**/*.php"
  - "backend/database/**/*.php"
---
# Domain Vocabulary

One domain word, one meaning per bounded context. Before using a domain word in a new identifier, grep its existing meaning in the model: if the word is taken, rename the existing usage or pick another word.

Reuse the term the code already uses for a concept (`like`, not `support` / `vote` / `soutien`), even when an ADR or doc words it differently.

**BAD**

```php
$this->chaptersR->branchWithSupportedContinuations($chapter);
```

**GOOD**

```php
$this->chaptersR->branchWithLikedContinuations($chapter);
```
