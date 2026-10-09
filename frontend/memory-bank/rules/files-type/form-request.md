---
paths:
  - "src/**/formRequest/**/*.js"
  - "**/*-form-request.js"
---
# Form Request

The form request is the input layer. It validates the form data against a rules object via `form.validate(rules, datas)` and returns `{ valid, errors }`. It is **synchronous and pure** and the **single source of truth for validation**.

- MUST NOT duplicate its rules in a service (`hasActiveFilters`), a controller or a computed (`canSearch`), see [no-passthrough-layers](../global/no-passthrough-layers.md).
- MUST NOT perform async or network work in `validate`.
- MAY mutate the form data to inject a **fixed business constant** imposed by the usage context, so the controller stays pure and business semantics are not scattered downstream.

```js
// GOOD
import { form } from '@/services/shortcuts/services-shortcut.js'

const novelFormRules = {
  'novel.genreId': {
    rules: 'required',
    format: datas => datas.novel?.genreId,
    errors: { required: 'novel_manage.error_genre_required' },
  },
}

export const validateNovelForm = datas => {
  datas.chapter.isDraft = true
  return form.validate(novelFormRules, datas)
}

// BAD
const create = async datas => {
  const body = NovelDto.toCreate({ ...datas, chapter: { ...datas.chapter, isDraft: true } })
}
```

## Naming

`{entity}-form-request.js` exporting `validate{Entity}Form` when one rule set covers every write of the entity. Qualify only when several really distinct actions coexist (`password-update`, `password-reset`, `login`, `register`). The form name passed to components and error keys follows (`form="novel"`, `novel.genreId`).

```js
// BAD
chapter-write-form-request.js
validateChapterWriteForm

// GOOD
chapter-form-request.js
validateChapterForm
```
