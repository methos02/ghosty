---
paths:
  - "backend/app/**/*.php"
  - "backend/database/**/*.php"
---
# English Identifiers

MUST write columns, properties, methods and API fields in English. Displayed messages stay French in `lang/fr/`: renaming a field never changes the message text.

After renaming a column, regenerate or fix `_ide_helper_models.php`, which PHPStan reads.

**BAD**

```php
$table->string('pseudo');
```

**GOOD**

```php
$table->string('username');
```
