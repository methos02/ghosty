---
paths:
  - "src/apis/**/controllers/*.js"
  - "src/services/form/**/*.js"
  - "src/views/**/*.vue"
---
# Validation Errors Via Form Service

422 errors MUST reach the form through the `form` option of the request: on a 422, the ajax service calls `form.addValidationErrors(errors, formName)` itself, which converts `snake_case` to `camelCase` and prefixes with the form name. MUST NOT call `form.addValidationErrors` in a controller, nor add a `*-error-dto.js` or a hand-maintained key table. The controller then returns the real response through `controllerResponseHelper.buildResponse`, never a fabricated `{ status: STATUS.ERROR }` that discards the 422 and its body.

A form spanning two resources declares one `form` scope per resource on its inputs (`form="novel"`, `form="chapter"`) with unprefixed names. Error keys then arrive already scoped (`chapter.title`) and route themselves: no alias table, no per-call error target. `addValidationErrors()` clears the form option before writing, its keys being already complete.

**BAD**

```js
return { status: STATUS.ERROR, errors: NovelErrorDto.fromErrors(response.data.errors) }
```

**BAD**

```js
if (response.status === STATUS.UNPROCESSABLE_ENTITY) {
  form.addValidationErrors(response.data.errors, 'novel')
}
```

**GOOD**

```js
const response = await NovelRepository.create({
  body: NovelDto.toCreate(formData),
  form: 'novel',
})
```
