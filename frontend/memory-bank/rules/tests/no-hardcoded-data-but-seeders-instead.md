---
paths:
  - "tests/**/*.test.js"
  - "tests/utils/seeders/**/*.js"
---
# No Hardcoded Data But Seeders Instead

MUST NOT define test data inline in a test file: use the seeders (`tests/utils/seeders/{entity}-seeder.js`, singular, one exported object `{entity}Seeder`). Pure-helper tests follow [inline-single-use-assertion-values](inline-single-use-assertion-values.md) instead.

| Forbidden | Example |
|---|---|
| Inline factory | `const createNovel = () => ({ ... })` |
| Inline test object | `const mockData = { id: 1, name: 'test' }` |
| Hardcoded assertion value | `expect(result.title).toBe('Le Roman Fantôme')`: read `novel.title` from the seeder |
| Complex nested override | `getNovel({ author: { id: 1, ... } })` |
| Inline response object | `{ status: STATUS.SUCCESS, data }`: use `controllerSuccess(data)` |

Only route names and translation keys stay literal. For translated text, the expected value is `t(key, params)` with params read from the seeder.

## Seeder forms

Two forms per entity, both mandatory from the creation of the seeder. The `Api` form is the single source of truth (snake_case, as returned by the backend); the domain form is **derived from it through the real DTO**, so it stays in sync and exercises the actual transformation.

| Suffix | Purpose | Example |
|---|---|---|
| `Api` | Raw API payload | `getNovelApi()`, `getNovelsApi(2)` |
| none | Domain form via the DTO | `getNovel()`, `getNovels(2)` |
| `Form` | Form input data | `getCreateForm()` |

```js
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'

const getNovelApi = (overrides = {}) => ({
  id: 1,
  slug: 'le-roman-fantome',
  title: 'Le Roman Fantôme',
  ...overrides,
})

const getNovelsApi = (count = 3) =>
  Array.from({ length: count }, (_, index) => getNovelApi({ id: index + 1 }))

const getNovel = (overrides = {}) => ({ ...NovelDto.fromShow(getNovelApi()), ...overrides })
const getNovels = (count = 3) => NovelDto.fromList(getNovelsApi(count))

export const novelSeeder = { getNovelApi, getNovelsApi, getNovel, getNovels }
```

```js
// BAD
expect(wrapper.text()).toContain('Alice a aimé votre chapitre')

// GOOD
const api = notificationSeeder.getNotificationApi()
expect(wrapper.text()).toContain(
  t('like_received_notification.one', { author: api.data.last_actor_username }),
)
```

Response helpers `controllerSuccess(data)` / `controllerError(status, error)` (`&/utils/helpers/controller-response.js`) wrap seeder data in the standard controller response.
