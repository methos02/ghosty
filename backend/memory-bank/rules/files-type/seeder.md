---
paths:
  - "backend/database/seeders/**/*.php"
---
# Seeder Rules

Seeders are **insert-only**. Never `truncate()` a table, never `Schema::disableForeignKeyConstraints()`.

Re-seeding is done with `php artisan migrate:fresh --seed` (schema recreated empty). `php artisan db:seed` alone is not a supported mode — it would duplicate rows and violate unique keys.

Data still lives in external JSON (`database/data/*.json`): the seeder reads the JSON and inserts.

```php
// BAD - destructive, and forces disabling FK constraints
Schema::disableForeignKeyConstraints();
DB::table('novels')->truncate();
Schema::enableForeignKeyConstraints();
foreach ($novels as $novel) { Novel::create($novel); }

// GOOD - insert-only
foreach ($novels as $novel) { Novel::create($novel); }
```
