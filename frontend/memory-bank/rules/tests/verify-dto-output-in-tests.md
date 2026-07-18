---
paths:
  - "tests/**/*.test.js"
---
# Verify DTO Output in Tests

Always verify that repository calls receive DTO-transformed data using `toHaveBeenCalledWith`.

```js
// BAD - raw data, DTO not verified
expect(SiteRepository.create).toHaveBeenCalledWith(formData)

// GOOD - DTO output verified
const formData = getSiteData()
await SiteController.create(formData)
expect(SiteRepository.create).toHaveBeenCalledWith(SiteDto.toApi(formData))
```
