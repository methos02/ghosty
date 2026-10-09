---
paths:
  - "backend/app/Models/**/*.php"
---
# Model Rules

## Column and relation types come from the ide-helper

`@property` annotations are generated in `_ide_helper_models.php` via `composer ide-helper` (`--write-mixin`), which also types a relation over a non-nullable foreign key as non-nullable (verified: `Chapter::$author` is `User`, `Chapter::$parent` is `Chapter|null`). The model keeps only `@mixin IdeHelperX` and `@see` ADR pointers. MUST fix a wrong nullable type in the migration (make the column non-nullable), never by overriding the annotation.

**BAD**

```php
/** @property string $type @property Carbon|null $read_at */
class Notification extends DatabaseNotification
```

**GOOD**

```php
/** @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md @mixin IdeHelperNotification */
class Notification extends DatabaseNotification
```

## Relation over a non-nullable foreign key

Read the id from the column (`$this->author_id`) and guard label access with `whenLoaded()` so serialization never triggers a silent N+1. MUST NOT use a nullsafe on a non-nullable relation.

**BAD**

```php
'author' => $this->author?->username,
```

**GOOD**

```php
'author' => $this->whenLoaded('author', fn () => $this->author->username),
```

## Reusable behavior goes in a trait in `Models/Concerns/`

MUST put cross-model behavior (`HasSlug`, `HasLikes`, `Reportable`) in a trait under `app/Models/Concerns/`, not inline in the model body. Expose an overridable hook (e.g. `slugSource()`); the model only does `use TheTrait`. PREFER a native trait over an external package for a simple need (@see decisions/ADR-02-slug-natif-sans-package.md).

## Denormalized counters

@see global/maintain-invariant-at-source.md
