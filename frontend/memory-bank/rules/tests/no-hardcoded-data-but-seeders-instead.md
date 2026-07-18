---
paths:
  - "tests/**/*.test.js"
---
# No Hardcoded Data - Use Seeders Instead

Never define test data inline in test files. Use seeder files.

## Forbidden Patterns

| Pattern | Example |
|---------|---------|
| Inline factory functions | `const createXxx = () => ({...})` |
| Inline test objects | `const mockData = { id: 1, name: 'test' }` |
| Hardcoded assertion values | `expect(result.name).toBe('CareUnit1')` -- retrieve dynamically instead |
| Complex nested overrides | `getUser({ groups: [{ group: { id: 1, ... } }] })` |
| Inline response objects | `{ status: STATUS.SUCCESS, data: ... }` |

Exception: imports from `&/utils/mocks/response-mock.js` are shared helpers, not inline data.

## Seeder Location and Naming

Location: `tests/utils/seeders/{entity}s-seeder.js`

| Suffix | Purpose | Example |
|--------|---------|---------|
| `Api` | API response data | `getSiteApi()`, `getSitesApi(2)` |
| `Data` | Form/user input data | `getSiteData()`, `getSitesData(2)` |

## Seeder Structure

```js
// tests/utils/seeders/sites-seeder.js
export const getSitesApi = (count, options = {}) => {
  const sites = []
  for (let index = 1; index <= count; index++) {
    sites.push({
      id: options.startId ? options.startId + index - 1 : index,
      name: options.name ?? `Site ${index}`
    })
  }
  return sites
}
export const getSiteApi = (options = {}) => getSitesApi(1, options)[0]
```

## Response Helpers

`tests/utils/mocks/response-mock.js` — wraps seeder data in API response format.

```js
import { createSuccessResponse, createErrorResponse } from '&/utils/mocks/response-mock.js'

vi.spyOn(Repository, 'index').mockResolvedValueOnce(
  createSuccessResponse({ items: getSitesApi(2), total: 2 })
)
```
