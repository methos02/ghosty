---
paths:
  - "tests/**/*.test.js"
---
# No Mock Current App Logic

MUST mock only external boundaries, never the current app's code. A spy to assert `toHaveBeenCalledWith` is allowed; replacing a return value is not.

| Mock (external) | Mock method |
|---|---|
| Repositories | `vi.spyOn(Repository, 'method').mockResolvedValue(...)` |
| HTTP / fetch | `globalThis.fetch = vi.fn().mockResolvedValue(...)` |
| Time | `vi.useFakeTimers()` |
| Console | `vi.spyOn(console, 'error')` |

| Do not mock (current app) | Do instead |
|---|---|
| DTOs, helpers, controllers, services | Run them for real |
| `utils.hydrate` | Mock the repository its target controller reaches (`byIds`); un-mocked hydration hits the real API and fails with `L'url de l'api ... est invalide` |

`localStorage` / `sessionStorage` work natively in jsdom: do not mock them.

```js
// BAD
vi.spyOn(NovelDto, 'fromList').mockReturnValue(transformedData)
vi.spyOn(utils, 'hydrate').mockResolvedValue(novels)

// GOOD
vi.spyOn(NovelDto, 'fromList')
await NovelController.list()
expect(NovelDto.fromList).toHaveBeenCalledWith(rawNovels)

// GOOD
vi.spyOn(AuthorRepository, 'byIds').mockResolvedValueOnce(controllerSuccess({ data: authorsApi }))
```
