---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Self-Documenting Code

Don't add comments. Express intent through clear names (functions, named predicates, explicit variables) and readable structure — including the *why*: restructure or rename instead of commenting. A genuine rationale that must be recorded goes into an ADR you reference, never inline prose. Only exception: functional directives that must be comments (e.g. `eslint-disable`).

```js
// BAD - redundant comment
/** for update price **/
const update = async (priceId, data) => {

// GOOD - name is self-explanatory
const updatePrice = async (priceId, data) => {

// BAD - "why" written as inline prose
// Price cannot be negative due to accounting system constraints
if (data.price < 0) { return false }

// GOOD - no prose; the rationale lives in an ADR, referenced
if (data.price < 0) { return false } // see ADR-012
```

A name ending in a preposition (`After`, `Before`, `With`, `From`, `Until`) with no anchor noun forces the reader to open the signature. Embed the anchor in the name, or drop the preposition.

```js
// BAD - "after" what? You have to open the signature to know
const getOccupationsAfter = (recurrenceId, cutoffDate) => { ... }

// GOOD - the name tells the whole story
const getOccupationsAfterDate = (recurrenceId, date) => { ... }
```

## Don't restate what the signature already carries

A name says *what is being asked*, not which types are involved — the parameters already show that.

```js
// BAD - both operands appear in the signature AND in the name
isBlockOverlappingPeriod(occupiedPeriod, block)

// GOOD
isOverlapping(occupiedPeriod, block)
```

Boundary with the preposition rule above: remove **redundant operands**, never leave a **dangling preposition**. `getOccupationsAfter` is still wrong (after *what*?); `isOverlapping` is right (the signature says what overlaps). Booleans keep their `is`/`has`/`can` prefix (`unicorn/consistent-boolean-name`).

## A name must match what it receives and returns

A function named after a domain entity takes that entity, not its exploded fields (see [no-redundant-param-with-object](no-redundant-param-with-object.md) for the parameter side). A name built as verb + input + output must be honest about the three.

```js
// BAD - the name says "holiday" but the function only sees loose dates
const daysCoveredByHoliday = (startDate, endDate) => { ... }

// GOOD - the entity named in the function is the one passed in
const convertHolidayToDateRange = (holiday) => { ... }
```

## Extract a named function when the name teaches something

Pull a sub-expression into a named internal function when the name clarifies intent — even if used once. The test is "does the name teach the reader something the inline expression doesn't", not the call count. Predicates passed to `filter`/`some`/`every` are the prime case.

```js
// BAD - inline predicate, intent buried
const active = users.filter(user => user.status === 'active' && !user.archivedAt)

// GOOD - named predicate states the intent
const isActive = user => user.status === 'active' && !user.archivedAt
const active = users.filter(user => isActive(user))
```

## Inline a wrapper that no longer teaches

The "extract when the name teaches" test cuts both ways. Once a helper's only caller disappears after a refactor, a single-use pass-through whose name adds nothing over its expression — and that has no dedicated test — should be inlined.

```js
// BAD - single caller; the name adds nothing the expression doesn't
const spanInDays = (start, end) => Math.round((new Date(end) - new Date(start)) / MS_PER_DAY)
const isMultiDay = (holiday) => spanInDays(holiday.startDate, holiday.endDate) > 0

// GOOD - inlined, no vestigial indirection
const isMultiDay = (holiday) =>
    Math.round((new Date(holiday.endDate) - new Date(holiday.startDate)) / MS_PER_DAY) > 0
```

## A name must describe current behavior, not a stale rename

When you change what a function does, resync its name in the same change — a name describing the old behavior is as misleading as an outdated comment. Applies notably to DTO `to{Action}` builders and `get*` queries: name them after what the route does *now*.

```js
// BAD - feeds the "reports" route but the name still claims "pending changes"
const toPendingChangesByGenres = (ids) => ({ params: { genreIds: ids } })

// GOOD - the name says what the route returns
const toReportsByGenres = (ids) => ({ params: { genreIds: ids } })
```

## Non-obvious algorithm: a doc, and one pointer line

An algorithm whose correctness is not readable from the code (counter-intuitive guards, allocation strategies) gets a document in `memory-bank/doc/algorithms/<sujet>.md` — in French, per [language-policy](language-policy.md) — covering the vocabulary, the diagrams, and each counter-intuitive step. The implementing file opens with a single pointer line:

```js
// Documentation : memory-bank/doc/algorithms/planning-segments.md
```

This is the second and last admitted comment, alongside the ADR reference. The pointer is a reference, never an explanation — any prose beyond the path belongs in the doc.
