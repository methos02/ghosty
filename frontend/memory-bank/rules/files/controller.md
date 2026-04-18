# Controller Rules

## Error Handling

**CRITICAL**: On error, return the response as-is instead of rebuilding an error object.

```javascript
// ✅ CORRECT
const getBySlug = async (slug) => {
  const response = await NovelRepository.getBySlug({ params: { slug } })
  if (response.status !== STATUS.SUCCESS) { return response }

  return {
    status: STATUS.SUCCESS,
    novel: NovelDto.fromShow(response.data)
  }
}

// ❌ INCORRECT - Don't rebuild error objects
const getBySlug = async (slug) => {
  const response = await NovelRepository.getBySlug({ params: { slug } })

  if (response.status !== STATUS.SUCCESS) {
    return {
      status: STATUS.ERROR,
      error: response.error || 'Erreur lors du chargement'
    }
  }

  return {
    status: STATUS.SUCCESS,
    novel: NovelDto.fromShow(response.data)
  }
}
```

## DTO Data Flow

**CRITICAL**: Always pass data through DTOs before sending to repository. DTOs are the single source of truth for API field names.

```javascript
// ✅ CORRECT - Body data via DTO
const register = async (datas) => {
  const data = AuthDto.toRegister(datas)
  const response = await AuthRepository.register({ body: data })
  // ...
}

// ✅ CORRECT - Params/filters via DTO
const getFirstChapter = async (novelSlug) => {
  const params = WorkDto.toChapterFilters(novelSlug, 1)
  const response = await WorkRepository.list({ params })
  // ...
}

// ❌ INCORRECT - API field names in controller
const getFirstChapter = async (novelSlug) => {
  const response = await WorkRepository.list({
    params: { novel_slug: novelSlug, order: 1, type: 1 }
  })
  // ...
}
```

**Why**: When API changes field names, update only the DTO - not every controller.

## Summary

- Early return pattern: `if (response.status !== STATUS.SUCCESS) { return response }`
- Transform input data via DTO before sending to repository (`Dto.toX()`)
- Transform response data via DTO on success (`Dto.fromX()`)
- Trust the repository response structure for errors
