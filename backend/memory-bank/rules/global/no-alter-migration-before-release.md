---
paths:
  - "backend/database/migrations/**"
---
# No Alter Migration Before First Release

While no version runs in production, data is disposable: edit the `create_*` migration of the table and run `php artisan migrate:fresh --seed`. Never add an `add_*` / `alter_*` migration. A foreign key to a table created later is declared in the migration that creates that table.

```php
// BAD - 0011_add_main_branch_last_chapter_to_novels_table.php
Schema::table('novels', fn (Blueprint $table) => $table->foreignId('main_branch_last_chapter_id')->nullable());

// GOOD - column in 0006_create_novels_table.php, foreign key in 0007_create_chapters_table.php
$table->unsignedBigInteger('main_branch_last_chapter_id')->nullable();
```
