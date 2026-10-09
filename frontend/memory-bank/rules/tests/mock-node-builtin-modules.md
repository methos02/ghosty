---
paths:
  - "tests/**/*.test.js"
---
# Mock Node Builtin Modules

In vitest 4.x, `vi.mock('node:fs')` without a factory does not automock Node built-ins (verified: `vi.isMockFunction(fs.existsSync)` is `false`). MUST pass an explicit factory from the shared utilities. `vi.mock()` stays in the test file (hoisting); only the factory is shared.

```js
// BAD
vi.mock('node:fs')

// GOOD
vi.mock('node:fs', async () => (await import('&/utils/mocks/fs-mock.js')).createFsMock())
vi.mock('node:path', async () => (await import('&/utils/mocks/path-mock.js')).createPathMock())
```

Defaults are set up in `beforeEach` through `setupFsMocks()` (`existsSync` -> true, `readdirSync` -> `[]`) and `setupPathDefaults(path)`. Reference: `tests/core/helpers/locale-helper.test.js`.
