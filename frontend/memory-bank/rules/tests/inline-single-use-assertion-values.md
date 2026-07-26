---
paths:
  - "tests/**/*.test.js"
---
# Inline Single-Use Assertion Values

A literal used exactly once, only inside one `expect(...)`, must be written inline — not extracted into a named `const` above the assertion. Keep a named variable only when it is reused: across several assertions, or between the call and the expectation.

```js
// BAD - each const is read exactly once, right below its declaration
it('formats a date to DD/MM/YYYY', () => {
  const inputDate = '2025-04-27'
  const format = 'DD/MM/YYYY'
  const expected = '27/04/2025'
  expect(dateHelper.formatDate(inputDate, format)).toBe(expected)
})

// GOOD - literals inlined, nothing to name
it('formats a date to DD/MM/YYYY', () => {
  expect(dateHelper.formatDate('2025-04-27', 'DD/MM/YYYY')).toBe('27/04/2025')
})

// GOOD - kept as a variable: `result` is reused across multiple assertions
it('returns the novel with derived fields', () => {
  const result = NovelDto.fromShow(getNovelApi())
  expect(result.title).toBe('The Ghost Ship')
  expect(result.author.pseudo).toBe('Author 1')
})
```

Grep check: a `const \w+ = '...'` (or a numeric/boolean literal) declared inside an `it` and referenced by name exactly once in the following lines is a violation — inline it.
