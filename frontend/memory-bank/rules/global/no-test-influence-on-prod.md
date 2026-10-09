---
paths:
  - "src/**/*"
---
# No Test Influence On Prod

Production code MUST NOT contain logic, conditions or flags that exist only to accommodate tests (`process.env.NODE_ENV === 'test'`, `isTest`). If tests need a different behaviour, mock it in the test setup.
