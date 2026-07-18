---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No API Names Outside DTO

API field names must only appear in DTO files. Controllers, services, components, and templates use domain names. The DTO maps domain names to API names via a constant.

```js
// BAD — API name in controller
const response = await Repository.search({ params: { sn: searchTerm } })

// BAD — API names in Vue template options
const searchOptions = ['sn', 'samaccountname', 'mail']

// GOOD — controller uses DTO
const response = await Repository.search(Dto.toSearch(searchTerm, typeSearch))

// GOOD — component uses domain names, DTO maps
const searchOptions = ['lastname', 'username', 'email']

// In DTO:
const SEARCH_TYPE_TO_PARAM = { lastname: 'sn', username: 'samaccountname', email: 'mail' }
const toSearch = (searchTerm, typeSearch) => ({
  params: { [SEARCH_TYPE_TO_PARAM[typeSearch]]: searchTerm }
})
```

## Exception: repository mock for an absent API

When a backend route does not exist yet, the repository may read/write snake_case API fields to simulate the response the real endpoint will return (see `repository.md` → *Simulating an absent API*). The repository is the wire boundary, so it owns the raw API shape; the exemption keeps controllers, services and DTOs backend-agnostic until the real API ships.
