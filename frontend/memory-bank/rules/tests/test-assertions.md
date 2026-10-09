---
paths:
  - "tests/**/*.test.js"
---
# Test Assertions

## One unique, useful behavior per test

MUST test what the function returns or does, not how it does it. Before writing a test ask: will anyone care if this fails, and does production code use this value?

| Test | Do not test |
|------|-------------|
| Return values, side effects | Internal implementation details |
| Repository called with the right arguments | Unused values, absence of data |
| Data transformation output | Internal state, call counts, variable types |

MUST NOT write redundant tests: two tests on the same call with different assertions, a transformation already covered by the DTO's own test, several tests on the same outcome, several tests for empty API returns (`null`, `[]`, `{}`: test the real empty case once). Controller tests cover the call; DTO tests cover the transformation.

```js
// BAD
expect(result.data).toBeUndefined()
expect(NovelRepository.list).toHaveBeenCalledTimes(1)

// GOOD
expect(result.status).toBe(STATUS.SUCCESS)
```

## Compare with the DTO output

MUST compare a controller result with the DTO transformation of the seeded API data, not property by property. MUST verify that a repository call receives the DTO-transformed data.

```js
// BAD
expect(result.data[0].id).toBe(1)
expect(NovelRepository.create).toHaveBeenCalledWith(formData)

// GOOD
const novelsApi = novelSeeder.getNovelsApi(2)
const result = await NovelController.list({ page: 1 })
expect(result.novels).toEqual(NovelDto.fromList(novelsApi))

const form = novelSeeder.getCreateForm()
await NovelController.create(form)
expect(NovelRepository.create).toHaveBeenCalledWith({ body: NovelDto.toCreate(form) })
```

## Arguments

MUST use `toHaveBeenCalledWith(args)` when the function takes arguments, `toHaveBeenCalled()` when it takes none. `toHaveBeenCalled()` is also valid when the arguments genuinely do not matter (analytics tracking). MUST NOT write an empty `toHaveBeenCalledWith()`.

```js
// BAD
expect(NovelRepository.create).toHaveBeenCalled()
expect(NovelRepository.list).toHaveBeenCalledWith()

// GOOD
expect(NovelRepository.create).toHaveBeenCalledWith({ body: NovelDto.toCreate(form) })
expect(GenreRepository.list).toHaveBeenCalled()
```
