---
paths:
  - "backend/database/migrations/*.php"
---
# Numbered Migrations

Migrations are named `NNNN_description.php` with a four-digit sequence number (`0001_create_users_table.php`), never a timestamp. Order is explicit instead of depending on the clock of whoever generated the file.

`php artisan make:migration` produces a dated name: rename it by hand. Two branches taking the same number collide at merge, visibly.
