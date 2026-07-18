---
paths:
  - "tests/**/*.test.js"
---
# Forbidden Test Patterns

Avoid loose matchers. Use explicit expected values.

| Forbidden Pattern | Problem |
|-------------------|---------|
| `expect.any(Object)` | Doesn't verify object structure |
| `expect.any(Array)` | Doesn't verify array content |
| `expect.anything()` | Accepts any value |
| `expect.objectContaining({})` | Empty = matches everything |

```js
// BAD
expect(result).toEqual({ data: expect.any(Object), items: expect.any(Array) })

// GOOD
expect(result).toEqual({ data: SiteDto.fromShow(mockApiData), items: [{ id: 1, name: 'Site 1' }] })
```

Exception: use loose matchers only for uncontrollable values (generated IDs, timestamps).
