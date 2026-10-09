---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Pass Data Object To Controllers

When calling a controller that forwards data to an API, MUST pass the source data object as one piece. The controller's DTO is the single transformation point. MUST NOT destructure fields at the call site — the controller would only re-assemble them, and the DTO loses its role as the boundary.

```js
// BAD
AuthorController.chapterSearch(formData.search, formData.genreId, formData.onlyActive)

const chapterSearch = async (search, genreId, onlyActive) => {
    const params = Dto.toFilters({ search, genreId, onlyActive })
    return Repository.search({ params })
}

// GOOD
AuthorController.chapterSearch(formData)

const chapterSearch = async (filters) => {
    const params = Dto.toFilters(filters)
    return Repository.search({ params })
}
```
