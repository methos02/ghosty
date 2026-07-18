---
paths:
  - "src/**/*.{js,vue}"
---
# Read Service Doc First

Before writing or modifying code that uses a vuemann service (`form`, `ajax`, `flash`, `auth`, `locale`, `log`, `router`, `websocket`, `utils`), read the corresponding `memory-bank/doc/services/{service}.md`. Never guess API shapes from surrounding code — existing usages may already be buggy.

Triggers:
- Import from `@brugmann/vuemann/src/shortcuts/services-shortcut.js` (any of `form`, `req`, `auth`, `flash`, `t`, `log`)
- Import from a specific service path under `@brugmann/vuemann/src/services/{service}/`
- Editing a `form-request.js` file, a controller using `req()`, or a component calling `form.validate()` / `flash.*()` / `auth.*()`

## Why

Copy-pasting from existing usages propagates bugs. A single typo (`valide` vs `valid` in `form.md`) caused three identical bugs across a child app because agents copied each other instead of verifying the source doc.
