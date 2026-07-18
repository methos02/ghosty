---
paths:
  - "tests/**/*.test.js"
---
# Compare With DTO Transformation

Compare controller results with DTO transformation output, not individual properties.

```js
// BAD - checking individual properties
expect(result.data[0].id).toBe(1)
expect(result.data[0].name).toBe('Site 1')

// GOOD - comparing with DTO transformation
const mockApiData = getSitesApi(2)
const result = await SiteController.index()
expect(result.data).toEqual(SiteDto.fromList(mockApiData))
```
