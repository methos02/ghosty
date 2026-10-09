---
paths:
  - "backend/app/**/*.php"
  - "backend/database/**/*.php"
---
# English Identifiers

Columns, properties, methods and API fields are in English. Displayed messages stay French in `lang/fr/`: renaming a field never changes the message text.

After renaming a column, regenerate or fix `_ide_helper_models.php`, which PHPStan reads.

**BAD**

```php
$table->string('pseudo');
```

**GOOD**

```php
$table->string('username');
```
