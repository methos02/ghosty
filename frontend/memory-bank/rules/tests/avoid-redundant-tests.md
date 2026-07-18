---
paths:
  - "tests/**/*.test.js"
---
# Avoid Redundant Tests

Each test verifies one unique behavior. Signs of redundancy:
- Two tests checking the same function call with different assertions
- A test verifying transformation already covered via DTO in another test
- Multiple tests asserting the same expected outcome
- Multiple tests for empty API returns (null, [], {}) — test the real empty case once

```js
// BAD - redundant: both test the same call
it('should call repository', async () => {
  await Controller.create(data)
  expect(Repository.create).toHaveBeenCalledWith(Dto.toApi(data))
})
it('should send correct format', async () => {
  await Controller.create({ name: 'test' })
  expect(Repository.create).toHaveBeenCalledWith({ name: 'test' })
})

// GOOD - one controller test + separate DTO test file
it('should call repository with transformed data', async () => {
  await Controller.create(data)
  expect(Repository.create).toHaveBeenCalledWith(Dto.toApi(data))
})
```
