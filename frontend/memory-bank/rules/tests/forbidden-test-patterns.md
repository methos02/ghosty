---
paths:
  - "tests/**/*.test.js"
---
# Forbidden Test Patterns

MUST assert explicit expected values. MUST NOT use loose matchers.

| Forbidden Pattern | Problem |
|-------------------|---------|
| `expect.any(Object)` | Doesn't verify object structure |
| `expect.any(Array)` | Doesn't verify array content |
| `expect.anything()` | Accepts any value |
| `expect.objectContaining({})` | Empty = matches everything |

```js
// BAD
expect(result).toEqual({ data: expect.any(Object) })

// GOOD
expect(result).toEqual({ data: NovelDto.fromShow(novelSeeder.getNovelApi()) })
```

Exception: a loose matcher is allowed only for an uncontrollable value (generated id, timestamp).
