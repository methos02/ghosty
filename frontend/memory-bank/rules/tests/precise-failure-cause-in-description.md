---
paths:
  - "tests/**/*.test.js"
---
# Precise Failure Cause in Description

A test's description — and its assertion — must name the exact cause of the behavior under test, not a vague category. When several distinct rules can produce the same broad outcome (`invalid`, `error`, `fails`), the description names the specific rule (`empty`, `invalid email format`), and the assertion checks the specific error rather than a generic presence check.

```js
// BAD - "invalid" doesn't say which rule failed; hasError() doesn't prove which one
it('does not call auth.login when the form is invalid', async () => {
  const wrapper = mount(LoginDialog)
  await wrapper.find('form').trigger('submit')
  expect(AuthController.login).not.toHaveBeenCalled()
  expect(form.hasError('login.email')).toBe(true)
})

// GOOD - description states the precise cause, assertion checks the specific error
it('does not call auth.login when the email is empty', async () => {
  const wrapper = mount(LoginDialog)
  await wrapper.find('form').trigger('submit')
  expect(AuthController.login).not.toHaveBeenCalled()
  expect(form.getError('login.email')).toBe('login.error_email_required')
})

it('does not call auth.login when the email format is invalid', async () => {
  const wrapper = mount(LoginDialog)
  await wrapper.find('input[name="email"]').setValue('not-an-email')
  await wrapper.find('form').trigger('submit')
  expect(AuthController.login).not.toHaveBeenCalled()
  expect(form.getError('login.email')).toBe('login.error_email_invalid')
})
```

Grep check: a description matching `/invalid|fails|error/` with no more specific noun (`empty`, `format`, the rule name), paired with `hasError(` instead of `getError(...).toBe(...)`, is a violation.

Exception: `hasError()`/`toHaveBeenCalled()` stay valid when the test's subject genuinely is "does any error exist" (e.g. asserting a submit is blocked in general), not which one.
