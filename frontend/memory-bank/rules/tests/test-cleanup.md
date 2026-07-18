---
paths:
  - "tests/**/*.test.js"
---
# Test Cleanup

Clean up in `afterEach`, never in `beforeEach` (redundant if every test cleans after itself).

Use `vi.clearAllMocks()` — never `vi.restoreAllMocks()` or `vi.resetAllMocks()` in `afterEach`. These destroy or reset global spies (e.g. `mockLogService` from `vitest.setup.js`), causing console noise in subsequent tests.

To override a global spy for one test, restore it in `beforeEach` of that specific `describe`, and re-mock it in `afterAll`.

```js
// GOOD
afterEach(() => {
  vi.clearAllMocks()
  // Reset stores/state if modified
})

// BAD — destroys global spies from vitest.setup.js
afterEach(() => {
  vi.restoreAllMocks()
})

// BAD — resets mockImplementation of global spies
afterEach(() => {
  vi.resetAllMocks()
})

// BAD — redundant, cleanup belongs in afterEach
beforeEach(() => {
  vi.clearAllMocks()
})
```

| Type | How to Clean |
|------|--------------|
| Mocks | `vi.clearAllMocks()` in `afterEach` |
| Stores | `store.reset()` or reset to initial state |
| Global state | Restore original values |
| DOM | Remove added elements |
| Timers | `vi.useRealTimers()` |
