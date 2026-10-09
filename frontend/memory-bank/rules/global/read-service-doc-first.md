---
paths:
  - "src/**/*.{js,vue}"
---
# Read Service Doc First

Before writing or modifying code that uses a Vuemann service (`form`, `ajax`, `flash`, `auth`, `locale`, `log`, `router`, `websocket`, `utils`), MUST read `memory-bank/doc/services/{service}.md`. MUST NOT guess API shapes from surrounding code: existing usages may already be buggy, and copy-pasting propagates the bug (one typo, `valide` for `valid` in `form.md`, caused three identical bugs because agents copied each other instead of the doc).

Triggers:
- an import from `@/services/shortcuts/services-shortcut.js` (`form`, `req`, `auth`, `flash`, `t`, `log`...);
- an import from a path under `@/services/{service}/`;
- editing a `*-form-request.js`, a controller using `req()`, or a component calling `form.validate()` / `flash.*()` / `auth.*()`.
