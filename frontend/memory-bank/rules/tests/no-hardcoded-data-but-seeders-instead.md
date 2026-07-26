---
paths:
  - "tests/**/*.test.js"
  - "tests/utils/seeders/**/*.js"
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

Exception: imports from `&/utils/helpers/controller-response.js` are shared helpers, not inline data.

## Seeder Location and Naming

Location: `tests/utils/seeders/{entity}-seeder.js` (singular) — export a single object named `{entity}Seeder` (e.g. `novelSeeder`).

| Suffix | Purpose | Example |
|--------|---------|---------|
| `Api` | Raw API payload (snake_case), source of truth | `getSiteApi()`, `getSitesApi(2)` |
| *(none)* | Domain form (camelCase), derived from the real DTO | `getSite()`, `getSites(2)` |
| `Data` | Form/user input data | `getSiteData()`, `getSitesData(2)` |

## Seeder Structure

Two forms per entity, like a Laravel factory: the `Api` form is the single source of truth (snake_case, as returned by the backend); the domain form is derived from it through the real DTO, so it stays in sync automatically and exercises the actual transformation instead of a hand-duplicated shape.

```js
// tests/utils/seeders/site-seeder.js
import { SiteDto } from '@/apis/sites/dtos/site-dto.js'

const getSitesApi = (count = 3, options = {}) => {
  const sites = []
  for (let index = 1; index <= count; index++) {
    sites.push({
      id: options.startId ? options.startId + index - 1 : index,
      name: options.name ?? `Site ${index}`
    })
  }
  return sites
}
const getSiteApi = (overrides = {}) => getSitesApi(1, overrides)[0]

const getSite = (overrides = {}) => ({ ...SiteDto.fromShow(getSiteApi()), ...overrides })
const getSites = (count = 3) => SiteDto.fromList(getSitesApi(count))

export const siteSeeder = { getSiteApi, getSitesApi, getSite, getSites }
```

Both forms are mandatory from the moment a seeder is created — never ship `getXxxApi()` alone and defer `getXxx()` to a later change. A seeder without its DTO-derived domain form is incomplete, not a valid intermediate state.

Tests reference seeded fields (`site.slug`, `site.name`) rather than duplicating literals in assertions.

## Response Helpers

`&/utils/helpers/controller-response.js` — wraps seeder data in the standard controller response format.

```js
import { controllerSuccess, controllerError } from '&/utils/helpers/controller-response.js'

vi.spyOn(Repository, 'index').mockResolvedValueOnce(
  controllerSuccess({ items: getSitesApi(2), total: 2 })
)
```
