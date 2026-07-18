---
paths:
  - "src/**/controllers/**/*.js"
---
# Controller Rules

On error, return response as-is. Never rebuild error objects. Always pass data through DTOs. Never call controller from controller (use Service).

```js
// Error handling
const get = async (slug) => {
  const response = await Repository.get({ params: { slug } })
  if (response.status !== STATUS.SUCCESS) { return response }
  return { status: STATUS.SUCCESS, data: Dto.fromShow(response.data) }
}

// BAD - rebuilding error object
if (response.status !== STATUS.SUCCESS) {
  return { status: STATUS.ERROR, error: response.error || 'Erreur' }
}

// BAD - API field names in controller
const response = await Repository.list({ params: { novel_slug: slug, order: 1 } })

// GOOD - DTO handles API field names
const params = Dto.toFilters(slug, 1)
const response = await Repository.list({ params })

// GOOD - body data via DTO
const data = Dto.toRegister(datas)
const response = await Repository.register({ body: data })
```

## Hydrate for Entity References

When a list/search result contains reference IDs, use `HydrateFunctions.hydrate()`. Never write manual fetch loops with caching.

Requirements:
- DTO maps reference to `{ id: X }` (e.g., `parent: { id: unit.parent_organisation_unit_id }`)
- Target controller exposes `byIds(ids)`
- Controller registered via `HydrateFunctions.registerController()` in `main.js`

```js
// BAD - manual fetch loop with cache
const parentsCache = {}
for (const unit of units) {
  if (parentsCache[unit.parentId] === undefined) {
    parentsCache[unit.parentId] = await getById(unit.parentId)
  }
  unit.parent = parentsCache[unit.parentId]
}

// GOOD - declarative hydrate
const units = Dto.fromSearches(response.data)
const hydrated = await HydrateFunctions.hydrate(units, ['parent'], {
  parent: { controller: 'organisationUnit' }
})
```

## Derive the return from the response, never re-type the value you sent

On a write, when the endpoint returns the persisted record, derive the result from `response.data` via the DTO — never a literal copy of what you just sent. Reading it back means a future change to the persisted value can't silently drift from what the caller is told. (Same principle as the read path above: always pass data through DTOs.)

When the endpoint returns nothing meaningful (`204 No Content`, bare status), there is nothing to read back — propagate the status alone; do not invent a `data` payload from what you sent.

```js
// BAD - hardcoded result, re-types the value just sent; drifts if the backend transforms it
const cancel = async (team) => {
  await Repository.updateStatus(Dto.toStatus(team.id, 'to_recertify'))
  return { status: STATUS.SUCCESS, certificationStatus: 'to_recertify' }
}

// GOOD - read the persisted value back from the response via the DTO
const cancel = async (team) => {
  const response = await Repository.updateStatus(Dto.toStatus(team.id, 'to_recertify'))
  if (response.status !== STATUS.SUCCESS) { return response }
  return { status: STATUS.SUCCESS, certificationStatus: Dto.fromStatus(response.data) }
}
```
