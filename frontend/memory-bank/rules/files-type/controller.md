---
paths:
  - "src/**/controllers/**/*.js"
  - "**/*-controller.js"
---
# Controller

A controller builds `{ params, body }` through the DTO, calls the repository, and returns the DTO-mapped result.

- MUST pass every payload and response through the DTO.
- MUST return the repository response as-is on error. MUST NOT rebuild an error object.
- MUST NOT call a controller from a controller: orchestrating two controllers is the job of a service ([service](service.md)).
- MUST judge success with `ajaxHelper.isSuccess(status)` (accepts `200`, `201`, `204`), never `status === STATUS.SUCCESS` alone: a creation answers `201` and the screen would not move. A controller that writes has at least one test simulating the status the API really returns.

```js
// GOOD
const get = async slug => {
  const response = await NovelRepository.get({ params: { slug } })
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }
  return { status: STATUS.SUCCESS, data: NovelDto.fromShow(response.data) }
}

// BAD
if (!ajaxHelper.isSuccess(response.status)) {
  return { status: STATUS.ERROR, error: response.error || 'Erreur' }
}

// BAD
const response = await NovelRepository.list({ params: { novel_slug: slug, order: 1 } })

// GOOD
const response = await NovelRepository.list({ params: NovelDto.toFilters(slug, 1) })
```

## Hydrate entity references

When a result carries reference ids, MUST use `utils.hydrate` (from `@/services/shortcuts/services-shortcut.js`). MUST NOT write a manual fetch loop with a cache.

Requirements:
- the DTO maps the reference to `{ id }` (`author: { id: data.author_id }`);
- the target controller exposes `byIds(ids)`;
- the target controller is registered once at app boot: `utils.registerController('author', AuthorController)`. Hydrating an unregistered name throws.

`utils.hydrate(data, keys, config)`: `config[key]` accepts `controller` (name, default = key), `method` (default `byIds`), `filter`, `entityKey` (default `id`).

```js
// BAD
const authorsCache = {}
for (const novel of novels) {
  authorsCache[novel.authorId] ??= await AuthorController.getById(novel.authorId)
  novel.author = authorsCache[novel.authorId]
}

// GOOD
const novels = NovelDto.fromList(response.data)
const hydrated = await utils.hydrate(novels, ['author'])
```

## Derive the result from the response

On a write whose endpoint returns the persisted record, MUST derive the result from `response.data` through the DTO, never from a literal copy of what was sent (the backend may transform it). When the endpoint returns nothing (`204`), propagate the status alone: MUST NOT invent a `data` payload.

```js
// BAD
const cancel = async novel => {
  await NovelRepository.updateStatus(NovelDto.toStatus(novel.id, 'draft'))
  return { status: STATUS.SUCCESS, publicationStatus: 'draft' }
}

// GOOD
const cancel = async novel => {
  const response = await NovelRepository.updateStatus(NovelDto.toStatus(novel.id, 'draft'))
  if (!ajaxHelper.isSuccess(response.status)) {
    return response
  }
  return { status: STATUS.SUCCESS, publicationStatus: NovelDto.fromStatus(response.data) }
}
```
