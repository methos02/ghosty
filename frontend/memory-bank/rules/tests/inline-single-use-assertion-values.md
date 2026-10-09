---
paths:
  - "tests/**/*.test.js"
---
# Inline Single-Use Assertion Values

Scope: tests of **pure helpers** (no seeder involved, e.g. `date-helper`, `form-helper`). For anything built from entity data, [no-hardcoded-data-but-seeders-instead](no-hardcoded-data-but-seeders-instead.md) wins: read the values from the seeder.

A literal used exactly once, only inside one `expect(...)`, MUST be written inline, not extracted into a named `const` above. Keep a named variable only when it is reused (across assertions, or between the call and the expectation).

```js
// BAD
it('formats a date to DD/MM/YYYY', () => {
  const inputDate = '2025-04-27'
  const expected = '27/04/2025'
  expect(dateHelper.formatDate(inputDate, 'DD/MM/YYYY')).toBe(expected)
})

// GOOD
it('formats a date to DD/MM/YYYY', () => {
  expect(dateHelper.formatDate('2025-04-27', 'DD/MM/YYYY')).toBe('27/04/2025')
})
```

Accepted cost: a literal repeated across tests of the same helper is duplicated instead of shared. Grep check: a `const \w+ = '...'` declared in an `it` and referenced once is a violation.
