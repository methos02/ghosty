---
paths:
  - "tests/**/*.test.js"
---
# Test Structure

MUST use one folder per module and one file per method, always with the `.test.js` suffix. Test folders mirror `src/`.

```
tests/apis/{domain}/controllers/{controller-name}/
  {controller-name}.{method1}.test.js
  {controller-name}.{method2}.test.js
```

Name: `{module-name}.{method-name}.test.js`.

```js
// BAD
describe('novel-controller', () => {
  describe('list', () => { ... })
  describe('create', () => { ... })
})

// GOOD
describe('novel-controller', () => {
  describe('list', () => { ... })
})
```

Assertion rules: [test-assertions](test-assertions.md).
