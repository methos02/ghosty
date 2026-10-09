---
paths:
  - "src/locales/**/*.json"
  - "src/services/*/locales/**/*.json"
  - "src/apis/*/locales/**/*.json"
---
# Translation

The `src/locales/{lang}/` hierarchy MUST mirror the source hierarchy it translates, file named `{name}-{lang}.json`.

- `src/components/DialogComponent.vue` -> `src/locales/fr/components/dialog-fr.json`
- `src/views/notifications/NotificationsPage.vue` -> `src/locales/fr/views/notifications/`
- `src/services/ajax/locales/{lang}/ajax-{lang}.json` (a service with its own `locales/` keeps them colocated)

Translations shared by two or more views/components go in `src/locales/{lang}/common-{lang}.json`.

MUST NOT:
- place a translation file at a path that does not reflect where the translated code lives;
- repeat the same key in several files: extract it to the common file.
