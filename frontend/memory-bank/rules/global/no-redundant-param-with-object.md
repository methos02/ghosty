---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Redundant Param With Object

When a function receives an object that already carries a property, don't accept that property as a separate parameter. Extract it inside the function. Passing both invites the caller to hand over an inconsistent pair (the argument and the property diverge) and bloats the signature.

Applies to any property: `id`, `name`, `status`, `type`, etc. — not just identifiers.

```js
// BAD - id already on `recurrence`
const stop = async (recurrenceId, recurrence, until) =>
    update(recurrenceId, { ...recurrence, until })

// GOOD - a single source of truth
const stop = async (recurrence, until) =>
    update(recurrence.id, { ...recurrence, until })

// BAD - status already on `chapter`
const notify = (status, chapter) => sendEmail(chapter.user, status)

// GOOD
const notify = (chapter) => sendEmail(chapter.user, chapter.status)
```

## A lone scalar stays positional

Symmetrically, don't invent an options object for a single boolean (or scalar): pass it as a positional parameter with a default value. The object carries no information, forces a `= {}` and often a rename to dodge a name collision it created itself. Reserve the options object for genuinely multiple or optional parameters.

The call-site variable documents the argument; the parameter name keeps its `is/has/should/...` prefix.

```js
// BAD - an object, a default and a rename, for a single boolean
const show = ({ withGumsSteps: withGums = true } = {}) => { ... }
show({ withGumsSteps: shouldRunGumsSteps })

// GOOD - positional parameter with a default
const show = (shouldShowGumsStep = true) => { ... }
show(shouldRunGumsSteps)
```
