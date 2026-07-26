---
paths:
  - "src/**/*.vue"
  - "src/**/*.js"
---
# Form Error Not Tied To One Input

An error that fails a form submission but doesn't belong to one specific field (wrong credentials, a 401, a business rule spanning several inputs) is a **form error**, not a field error and not an app-level global error. Model it with `form.addError('<form>.<name>', '<translation_key>')` under a logical name (e.g. `login.unauthorize`), and display it with a standalone `<ErrorFormComponent name="<form>.<name>" />` placed in the form — see `memory-bank/doc/services/form.md`.

Never build a parallel "global error" mechanism in the `utils` service for this. `utils`' `errorsGlobal` (see `memory-bank/doc/services/utils.md`) is reserved for app-level fatal status (`utils.apiStatus()`, the `/error` route) — it is not visible inside a dialog and must never carry a per-submission business failure like a login rejection.

```js
// BAD - business submission failure routed through the app-level global error mechanism
const login = async (credentials) => {
  const response = await AuthController.login(credentials)
  if (response.status !== STATUS.SUCCESS) {
    utils.addGlobalError('login.unauthorize') // wrong layer: this is app-level, route /error
    return
  }
}
```

```js
// GOOD - modeled as a form error, displayed locally in the dialog
const login = async (credentials) => {
  const response = await AuthController.login(credentials)
  if (response.status !== STATUS.SUCCESS) {
    form.addError('login.unauthorize', 'auth.login_error_unauthorize')
    return
  }
}
```

```vue
<!-- GOOD - standalone ErrorFormComponent, not tied to a single input's name -->
<template>
  <form @submit.prevent="login">
    <InputComponent name="email" v-model="formData.email" />
    <InputComponent name="password" v-model="formData.password" />
    <ErrorFormComponent name="login.unauthorize" />
    <button type="submit">{{ t('auth.login') }}</button>
  </form>
</template>
```

Grep check: `utils.addGlobalError`, `errorsGlobal.push`, or any new `utils`-service global-error helper used outside `utils.apiStatus()` is a violation — replace with `form.addError` + `<ErrorFormComponent>`.
