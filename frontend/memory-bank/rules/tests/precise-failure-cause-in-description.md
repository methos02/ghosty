---
paths:
  - "tests/**/*.test.js"
---
# Precise Failure Cause In Description

A test's description and its assertion MUST name the exact cause of the behaviour under test. When several rules can produce the same broad outcome (`invalid`, `error`, `fails`), name the specific rule (`empty`, `invalid email format`) and assert the specific error with `getError(...)`, not a generic presence check with `hasError(...)`.

Exception: `hasError()` / `toHaveBeenCalled()` stay valid when the subject is genuinely "does any error exist" (a submit is blocked at all).

```js
// BAD
it('does not call auth.login when the form is invalid', async () => {
  expect(form.hasError('login.email')).toBe(true)
})

// GOOD
it('does not call auth.login when the email is empty', async () => {
  expect(AuthController.login).not.toHaveBeenCalled()
  expect(form.getError('login.email')).toBe('login.error_email_required')
})

it('does not call auth.login when the email format is invalid', async () => {
  await wrapper.find('input[name="email"]').setValue('not-an-email')
  await wrapper.find('form').trigger('submit')
  expect(form.getError('login.email')).toBe('login.error_email_invalid')
})
```

Grep check: a description matching `/invalid|fails|error/` with no more specific noun, paired with `hasError(`, is a violation.
