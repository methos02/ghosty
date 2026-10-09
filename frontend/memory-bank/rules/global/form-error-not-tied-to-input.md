---
paths:
  - "src/**/*.vue"
  - "src/**/*.js"
---
# Form Error Not Tied To Input

An error that fails a submission without belonging to one field (wrong credentials, a 401, a business rule spanning several inputs) is a **form error**: neither a field error nor an app-level global error.

- MUST model it with `form.addError('<form>.<name>', '<translation_key>')` under a logical name (`login.unauthorize`).
- MUST display it with a standalone `<ErrorFormComponent name="<form>.<name>" />` inside the form (`memory-bank/doc/services/form.md`).
- MUST NOT route it through the `utils` service: `utilsStore.setAppError` / `errorsGlobal` are reserved for app-level fatal status (`/error` route). They are not visible inside a dialog.

```js
// BAD
if (!ajaxHelper.isSuccess(response.status)) {
  utilsStore.setAppError('login.unauthorize')
  return
}

// GOOD
if (!ajaxHelper.isSuccess(response.status)) {
  form.addError('login.unauthorize', 'auth.login_error_unauthorize')
  return
}
```

```vue
<form @submit.prevent="login">
  <InputComponent name="email" v-model="formData.email" />
  <InputComponent name="password" v-model="formData.password" />
  <ErrorFormComponent name="login.unauthorize" />
  <button type="submit">{{ t('auth.login') }}</button>
</form>
```

Grep check: `utilsStore.setAppError` or `errorsGlobal` used outside app boot / status handling is a violation.
