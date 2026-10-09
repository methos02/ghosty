---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Redundant Param With Object

When a function receives an object that already carries a property (`id`, `name`, `status`, `type`...), MUST NOT accept that property as a separate parameter: read it from the object. Passing both invites an inconsistent pair and bloats the signature.

```js
// BAD
const publish = async (chapterId, chapter, notify) => update(chapterId, { ...chapter, notify })

// GOOD
const publish = async (chapter, notify) => update(chapter.id, { ...chapter, notify })
```

## A lone scalar stays positional

MUST NOT invent an options object for a single boolean or scalar: pass it positionally with a default. Reserve the options object for several or optional parameters. The call-site variable documents the argument; the parameter keeps its `is/has/should` prefix.

```js
// BAD
const show = ({ withNotice: shouldShowNotice = true } = {}) => { ... }
show({ withNotice: shouldNotify })

// GOOD
const show = (shouldShowNotice = true) => { ... }
show(shouldNotify)
```
