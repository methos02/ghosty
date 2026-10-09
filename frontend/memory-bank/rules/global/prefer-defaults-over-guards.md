---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Prefer Defaults Over Guards

Set defaults at declaration (refs, parameters, state factories) so consumers need no guard. DTO defaults follow [dto](../files-type/dto.md): only on optional or nullable API fields, never on required ones nor in `to{Action}`.

## Defaults at source

- MUST initialize refs with a typed default: `ref([])`, `ref({})`. `ref()` is fine for "no value yet"; never `ref(undefined)`.
- Name parameters after the domain, with a default: `(novels = [])`.

## State factories

A factory building a default state (filters, form, search) MUST always include containers (`{}`, `[]`) and omit scalars: a missing key reads `undefined` anyway, so `key: undefined` is noise. A consumer reading such a store drops the `?.` on container access: the factory is the contract. `?.` stays justified at system boundaries (API response, query string, optional inject, prop without default).

```js
// GOOD
const createDefaultFilters = () => ({
  sort: 'popular',
  genre: {},
  tags: [],
})
const hasGenreFilter = filters => filters.genre.id || filters.genre.slug

// BAD
const createDefaultFilters = () => ({
  sort: 'popular',
  genre: { id: undefined, slug: undefined },
  tags: [],
  search: undefined,
})
const hasGenreFilter = filters => filters.genre?.id || filters.genre?.slug
```

## Order early returns

When a guard is unavoidable, MUST order the early returns so the code after them reads properties without `?.`.

```js
// BAD
if (options.empty404 && error.response?.status === 404) {
  return { data: [], status: 200 }
}
if (error.response === undefined) {
  return { data: { error: 'error_server' }, status: 500 }
}

// GOOD
if (error.response === undefined) {
  return { data: { error: 'error_server' }, status: 500 }
}
if (options.empty404 && error.response.status === 404) {
  return { data: [], status: 200 }
}
```

## Do not re-check an upstream guard

MUST NOT re-check, with a fallback, a condition already guaranteed by a parent guard (a button hidden by `v-if`, a protected route, a form validator blocking submission): dead defensive code rots silently when the upstream guard changes. Guards stay valid at system boundaries (user input, API errors), in business logic and on DOM template refs.

```js
// BAD
const open = () => {
  formData.value = { title: chapter.value.isDraft ? chapter.value.title : '' }
  dialog.value.show()
}

// GOOD
const open = () => {
  formData.value = { title: chapter.value.title }
  dialog.value.show()
}
```
