---
paths:
  - "src/**/dtos/**/*.js"
  - "**/*-dto.js"
---
# DTO

The DTO is the only place that knows API field names and the only boundary between API shape and domain shape. Properties are camelCase; related properties are grouped in sub-objects.

## Naming

Suffix with the **API action**, never `fromApi` / `toApi`, and never an `Api` suffix (`to{Action}` is already an API payload).

- `from{Action}(data)`: API response to domain. Plural `from{Action}s(datas)`. The first parameter is `data` / `datas`, never the entity name.
- `to{Action}(formData)`: form to API body. `to{Action}Params` builds the query params of a read route (`toListParams`, `toShowParams`; 10 occurrences in the code).
- `toForm{Action}(entity)`: stored entity to form shape (no API boundary).
- Encode in the name an entity that shapes the output: `fromSearchByAuthor(data, author)`.

```js
// BAD
const fromApi = user => ({ id: user.id })

// GOOD
const fromShow = data => ({ id: data.id })
```

## API names stay in the DTO

Controllers, services, components and templates MUST use domain names. The DTO maps them to API names.

```js
// BAD
const searchOptions = ['novel_title', 'author_name']
const response = await NovelRepository.search({ params: { novel_title: term } })

// GOOD
const searchOptions = ['title', 'author']
const response = await NovelRepository.search({ params: NovelDto.toSearch(term, searchType) })

const SEARCH_TYPE_TO_PARAM = { title: 'novel_title', author: 'author_name' }
const toSearch = (term, searchType) => ({ [SEARCH_TYPE_TO_PARAM[searchType]]: term })
```

Exception: a repository simulating an absent endpoint writes the raw API shape ([repository](repository.md)).

## Defaults

One rule: **default only the fields the API documents as nullable or optional; read every required field directly.** A required key that is missing means the API contract changed: let it crash.

- `from{Action}`: `??` / `utilsH.voidToEmpty(data, exclude)` on optional fields only. `voidToEmpty` processes the keys present and never invents missing ones.
- `to{Action}`: no defaults. The form request already guarantees the required fields. `toForm{Action}` needs defaults: its input is not validated.
- Trust documented types: no `Array.isArray()` polymorphism on a documented array. Fix the API or document the polymorphism.
- `utilsH.voidToNull(value)` only for a clearable field where the API needs an explicit `null`.

```js
// BAD
const fromShow = data => ({
  title: data.title ?? '-',
  authorIds: Array.isArray(data.author_ids) ? data.author_ids : [data.author_ids],
})

// GOOD
const fromShow = data => ({
  title: data.title,
  authorIds: data.author_ids,
  summary: data.summary ?? '',
  tags: data.tags ?? [],
})
```

Do not guard `to{Action}` assignments with `!== undefined`: the ajax layer drops `undefined` body values (JSON) and query params (`customParamsSerializer`). If a test asserts strict equality on the payload, fix the test.

```js
// BAD
if (filters.genreId !== undefined) {
  payload.genre_id = filters.genreId
}

// GOOD
const toSearch = filters => ({ ...buildBase(filters), genre_id: filters.genreId })
```

## Display

- Display formatting (dates, casing, joined names, placeholders) belongs in `from{Action}`; components render the value as-is. A field needing both raw and display values exposes `x` and `xFormat`; the placeholder (`'-'`) goes on `xFormat` only.
- Exception: when variants each render their own sentence or link, the DTO only maps the variant data (`lastActorUsername`, `count`); one view component per variant builds the `t()` text and the route.
- Dispatch variant fields under `payload`, one DTO file per variant, with `if` guards ([if-guards-over-lookup-object](../language/js/if-guards-over-lookup-object.md)); throw first on an unknown variant.

```js
// BAD
const fromShow = data => ({ publishedAt: data.published_at ? format(data.published_at) : '-' })

// GOOD
const fromShow = data => ({
  publishedAt: data.published_at,
  publishedAtFormat: data.published_at ? dateHelper.formatDate(data.published_at) : '-',
})
```

## Lists

- MUST expose a plural method that maps through the singular; the caller passes the whole array, never loops on the singular.
- The default order of a list belongs in the plural mapper (via a helper). A consumer with its own ordering overrides locally.
- When extending a base DTO with `...fromShow(data)`, MUST NOT replace one of its arrays or objects: add a sidecar key (`searchedAuthor`).

```js
// BAD
const fromSearchByAuthor = (data, author) => ({ ...fromShow(data), authors: [author] })

// GOOD
const fromSearchByAuthor = (data, author) => ({
  ...fromShow(data),
  searchedAuthor: { id: author.id, username: author.username },
})

const fromList = datas => datas.map(data => fromShow(data))
```
