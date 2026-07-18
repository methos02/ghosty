---
paths:
  - "tests/**/*.test.js"
---
# Test Only Useful Behavior

Test what the function returns/does, not how it achieves it.

| Test | Don't Test |
|------|------------|
| Return values, side effects | Internal implementation details |
| Repository called with correct params | Unused values, absence of data |
| Data transformation output | Internal state, call counts, variable types |

Before writing a test: "Will anyone care if this fails?" and "Does production code use this value?"

```js
// BAD - testing unused value
expect(result.data).toBeUndefined()

// BAD - testing call count when we only care it was called
expect(Repository.index).toHaveBeenCalledTimes(1)

// GOOD - tests actual return value
expect(result.status).toBe(STATUS.SUCCESS)

// GOOD - tests data transformation
expect(result.data).toEqual(UserDto.fromIndex(rawUsers))
```
