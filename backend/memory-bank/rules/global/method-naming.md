---
paths:
  - "backend/app/Services/**/*.php"
  - "backend/app/Policies/**/*.php"
  - "backend/app/Repositories/**/*.php"
  - "backend/tests/**/*.php"
---
# Method Naming

## CRUD verbs by default

- MUST use `create`, `update`, `delete`, `find`, `paginate` for services, policies and repositories. Repositories also use `increment{Column}`, matching the column name exactly.
- MUST add a qualifier only when it distinguishes the method from its siblings. With a single variant, drop it; when an exception appears, the exception takes the explicit name (`ChapterService::createChild`: creation requiring a parent).
- MUST NOT claim a lifecycle (`start`, `init`, `first`) or use a synonym of the column name.
- MUST use a business verb only for a state transition with its own effects (`publish`: counters, activity).
- MUST merge two methods with identical bodies; the distinction lives elsewhere.
- MUST drop a suffix true for every call (`WithRelations` when no variant lacks relations).

## Explicit names

- MUST state what the method returns (type, source, what is added), never a concept absent from the schema nor its algorithm. Variables follow the same rule.
- MUST NOT end a method name with a bare preposition (`With`, `Through`, `For`, `Of`, `By`): put the complement in the name (`draftsByOwner`, `branchWithUnlikedContinuations`). PREFER a participle stating the relation (`Containing`, `ToFollow`).
- MUST NOT use an implicit pronoun (`idOf`, `paginateFor`) or a metaphor (`elected`, `strongest`, `withdraw`, `carries`): use the literal term.
- Parameter: name what it is or its relation (`parent`, `attachedTo`), never a relative position (`under`, `above`, `next`). Do not restate the parameter type in the method name; put the role in the parameter name (`branchToFollow(Chapter $currentChapter)`).
- Accessor: named after the returned type and source (`pathChapterIds`, not `branchIds` when branches have no table).
- Query: states the nature (`draftNovelIds`: identifiers, of novels, in draft); MUST NOT suggest a stored state that is derived.
- `last...` / `...End`: only for a real domain boundary.
- Before naming a non-trivial method, trace its callers and name it after what the caller uses it for (`branchToFollow`), not after how it computes (`mostPopular...`).

**BAD**

```php
$this->chaptersR->startBranchLikeCount($chapter);
$this->likesR->idOf($userId, $chapter);
$this->notificationsR->paginateFor($recipient, $perPage);
```

**GOOD**

```php
$this->chaptersR->updateBranchLikeCount($chapter, $parent);
$this->likesR->findUserLikeId($userId, $chapter);
$this->notificationsR->paginate($recipient, $perPage);
```
