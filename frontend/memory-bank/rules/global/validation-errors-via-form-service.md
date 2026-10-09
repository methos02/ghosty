---
paths:
  - "src/apis/**/controllers/*.js"
  - "src/services/form/**/*.js"
  - "src/views/**/*.vue"
---
# Validation Errors Via The Form Service

422 errors go through `form.addValidationErrors(validationErrors, formName)`, which converts `snake_case` to `camelCase` and prefixes with the form name. No `*-error-dto.js`, no hand-maintained key table. The controller then returns the real response (`if (!ajaxHelper.isSuccess(response.status)) return response`), never a fabricated `{ status: STATUS.ERROR }` that discards the 422 and its body.

A form spanning two resources declares one `form` scope per resource on its inputs (`form="novel"`, `form="chapter"`) with unprefixed names. Error keys then arrive already scoped (`chapter.title`) and route themselves: no alias table, no per-call error target. `addValidationErrors()` clears the form option before writing, its keys being already complete.

**BAD**

```js
return { status: STATUS.ERROR, errors: NovelErrorDto.fromErrors(response.data.errors) }
```

**GOOD**

```js
form.addValidationErrors(response.data.errors, 'novel')
return response
```
