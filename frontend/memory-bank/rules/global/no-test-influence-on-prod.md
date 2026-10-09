---
paths:
  - "src/**/*"
---
# No Test Influence on Prod

Production code must never contain logic, conditions, or flags that exist solely to accommodate tests (`process.env.NODE_ENV === 'test'`, `isTest`, etc.). If tests need different behavior, mock it in the test setup.
