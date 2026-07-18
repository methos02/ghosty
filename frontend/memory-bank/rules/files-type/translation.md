---
paths:
  - "src/locales/**/*.json"
  - "src/services/*/locales/**/*.json"
  - "src/apis/*/locales/**/*.json"
---
# Translation File Structure

`src/locales/` hierarchy must mirror the source hierarchy it translates.

- `src/views/componentsPage/DialogPage.vue` → `src/locales/{lang}/components/dialog/dialog-component.json`
- `src/helpers/date-helper.js` → `src/locales/{lang}/helpers/date-helper.json`
- `src/services/form/views/inputs/InputDate/` → `src/locales/{lang}/services/form/views/inputs/InputDate/`

## Colocated translations

Services and APIs with their own `locales/` folder keep translations colocated:
- `src/services/ajax/locales/{lang}/ajax-{lang}.json`
- `src/apis/users/locales/{lang}/users-{lang}.json`

## Common translations

Translations shared across ≥2 views/components go in `src/locales/{lang}/common-{lang}.json`. Never duplicate the same key across files.

## Forbidden

- Translation file path that does not reflect where the translated code lives
- Same key in multiple files — extract to the common file
