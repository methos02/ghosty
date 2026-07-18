---
paths:
  - "tests/**/*.test.js"
---
# Mock Node Built-in Modules

In vitest 4.x, `vi.mock('node:fs')` without a factory does not create a correct automock for Node built-ins. Use an explicit factory via centralized utilities.

```js
// BAD
vi.mock('node:fs')
vi.mock('node:path')

// GOOD
vi.mock('node:fs', async () => (await import('&/utils/mocks/fs-mock.js')).createFsMock())
vi.mock('node:path', async () => (await import('&/utils/mocks/path-mock.js')).createPathMock())
```

`vi.mock()` must stay in the test file (vitest hoisting). Only the factory is shared.

Default setup in `beforeEach`:
- `setupFsMocks()` — existsSync → true, readdirSync → []
- `setupPathDefaults(path)` — resolve, join, dirname, extname
