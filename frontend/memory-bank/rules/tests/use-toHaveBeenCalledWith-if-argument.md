---
paths:
  - "tests/**/*.test.js"
---
# Use toHaveBeenCalledWith If Arguments

Use `toHaveBeenCalledWith(args)` when the function takes arguments. Use `toHaveBeenCalled()` when it takes none.

```js
// BAD - doesn't verify arguments
expect(Repository.create).toHaveBeenCalled()

// BAD - empty toHaveBeenCalledWith is misleading
expect(Repository.index).toHaveBeenCalledWith()

// GOOD - verifies arguments
expect(Repository.create).toHaveBeenCalledWith(Dto.toApi(data))

// GOOD - no args, use toHaveBeenCalled
expect(Repository.index).toHaveBeenCalled()
```

Exception: use `toHaveBeenCalled()` when arguments genuinely don't matter (e.g., analytics tracking).
