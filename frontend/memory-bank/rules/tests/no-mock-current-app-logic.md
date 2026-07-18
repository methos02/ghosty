---
paths:
  - "tests/**/*.test.js"
---
# No Mock Current App Logic

Never mock current app code. Only mock external boundaries.

| Mock (external) | Don't Mock (current app) |
|-----------------|--------------------------|
| Repositories | DTOs |
| External APIs | Helpers |
| Browser APIs | Controllers |
| External services | Services |

You CAN spy on app code to assert `toHaveBeenCalledWith`. You CANNOT mock it to replace its return value.

```js
// BAD - mocking return value of app code
vi.spyOn(SiteDto, 'fromList').mockReturnValue(transformedData)

// BAD - mocking a vuemann helper's return value (utils.hydrate reaches the API)
vi.spyOn(utils, 'hydrate').mockResolvedValue(dto)
// -> mock the repository it calls instead (see mock-external-services)

// GOOD - spy only, assert it was called
vi.spyOn(SiteDto, 'fromList')
await SiteController.index()
expect(SiteDto.fromList).toHaveBeenCalledWith(rawData)

// GOOD - real DTO call in assertion
expect(SomeService.process).toHaveBeenCalledWith(SiteDto.fromList(rawData))
```
