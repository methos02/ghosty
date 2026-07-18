---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Pass Data Object To Controllers

When calling a controller that forwards data to an API, pass the source data object as one piece. The DTO of the controller is the single transformation point. Do not destructure fields at the call site — the controller would only re-assemble them, and the DTO loses its role as the boundary.

```js
// BAD - data destructured at the call site, re-bundled inside the controller
//       only to be handed to the DTO
AuthorController.chapterSearch(formData.search, formData.genreId, formData.onlyActive)

const chapterSearch = async (search, genreId, onlyActive) => {
    const params = Dto.toFilters({ search, genreId, onlyActive })
    return Repository.search({ params })
}

// GOOD - the data object travels intact; the DTO owns the transformation
AuthorController.chapterSearch(formData)

const chapterSearch = async (filters) => {
    const params = Dto.toFilters(filters)
    return Repository.search({ params })
}
```
