---
paths:
  - "tests/**/*.test.js"
---
# Use Fake Timers With Delay

When code under test uses `setTimeout`/`setInterval`/`delay()`, use `vi.useFakeTimers()` — real timers hang in CI. Never `await` a function containing a delay directly. Split: start promise, advance timers, then await.

```js
beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())
```

```js
const promise = composable.show(data)
await vi.advanceTimersByTimeAsync(100)
await promise
```
