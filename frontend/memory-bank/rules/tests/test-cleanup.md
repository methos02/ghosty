---
paths:
  - "tests/**/*.test.js"
---
# Test Cleanup

Principle: [cleanup-on-close-or-unmount](../global/cleanup-on-close-or-unmount.md). A test cleans up after itself in `afterEach`; `beforeEach` is for setup only, never for cleaning what a previous test left.

- MUST use `vi.clearAllMocks()` in `afterEach`.
- MUST NOT use `vi.restoreAllMocks()` or `vi.resetAllMocks()` in `afterEach`: `vitest.setup.js` installs global spies (`logMock()` spies on `log.debug/error/info/warn`). Verified: after `vi.restoreAllMocks()`, `vi.isMockFunction(log.error)` is `false` (console noise in later tests); after `vi.clearAllMocks()` it stays `true`.
- To override a global spy for one test, restore it in the `beforeEach` of that `describe` and re-install it in `afterAll` (`logMock()`).

```js
// GOOD
afterEach(() => {
  vi.clearAllMocks()
})

// BAD
afterEach(() => {
  vi.restoreAllMocks()
})

// BAD
beforeEach(() => {
  vi.clearAllMocks()
})
```

| Type | How to clean |
|---|---|
| Mocks | `vi.clearAllMocks()` in `afterEach` |
| Stores | `store.reset()` or reset to the initial state |
| Global state | Restore the original values |
| DOM | Remove the added elements |
| Timers | `vi.useRealTimers()` in `afterEach` |

## Fake timers

When the code under test uses `setTimeout`, `setInterval` or a `delay()`, MUST use `vi.useFakeTimers()` and MUST NOT `await` the delayed call directly (real timers hang CI). Start the promise, advance the timers, then await it.

```js
beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const promise = delayedAction()
await vi.advanceTimersByTimeAsync(100)
await promise
```
