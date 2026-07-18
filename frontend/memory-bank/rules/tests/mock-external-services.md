---
paths:
  - "tests/**/*.test.js"
---
# Mock External Services

Mock only external dependencies, not internal logic.

| Category | Mock Method |
|----------|-------------|
| Repositories | `vi.spyOn(Repository, 'method').mockResolvedValue(...)` |
| Fetch/HTTP | `globalThis.fetch = vi.fn().mockResolvedValue(...)` |
| Time | `vi.useFakeTimers()` |
| Console | `vi.spyOn(console, 'error')` |

localStorage/sessionStorage work natively in jsdom, no need to mock them.

## Do not mock

| Do not mock | Mock instead |
|-------------|--------------|
| `utils.hydrate` (internal logic) | the repositories it reaches — the hydrated entity's `byIds` |

Un-mocked hydration hits the real API: `L'url de l'api ... est invalide`.

```js
// BAD - replacing the helper's return value (utils.hydrate is current-app logic)
vi.spyOn(utils, 'hydrate').mockResolvedValue(Dto.fromList(data))

// GOOD - mock the repository hydrate reaches (the hydrated entity's byIds); hydrate runs for real
vi.spyOn(BoxRepository, 'byIds').mockResolvedValueOnce(createSuccessResponse(boxes))
await Controller.byRecurrence(7)
```

Mocking `utils.hydrate` itself replaces current-app logic (see [no-mock-current-app-logic](no-mock-current-app-logic.md)): spy it only to assert the call, never `mockResolvedValue` it.
