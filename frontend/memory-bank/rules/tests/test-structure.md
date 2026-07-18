---
paths:
  - "tests/**/*.test.js"
---
# Test Structure

One folder per module, one file per method. Always use `.test.js` suffix.

```
tests/apis/{domain}/controllers/{controller-name}/
  {controller-name}.{method1}.test.js
  {controller-name}.{method2}.test.js
```

Naming: `{module-name}.{method-name}.test.js`

```js
// BAD - multiple methods in one file
describe('controller-name', () => {
  describe('methodA', () => { ... })
  describe('methodB', () => { ... }) // SPLIT into separate file
})

// GOOD - one method per file (auth-store.login.test.js)
describe('auth-store', () => {
  describe('login', () => { ... })
})
```
