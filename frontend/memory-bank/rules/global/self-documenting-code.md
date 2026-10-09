---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Self-Documenting Code

MUST NOT write explanatory comments (prose, docblocks, section banners, the *why*). Express intent through names and structure; restructure or rename instead of commenting. Naming rules: [naming](naming.md).

Only admitted comments:
- tooling directives (`eslint-disable-next-line`, `@ts-expect-error`) and JSDoc type tags the tooling needs (`@param`, `@return`, `@type`);
- a pointer to a record: `// see ADR-xx`. A rationale that must be kept, or a non-obvious algorithm, goes into an ADR (`memory-bank/decisions/`, French) and the code keeps that single pointer line. Never inline prose.

```js
// BAD
/** for update price **/
const update = async (priceId, data) => {

// GOOD
const updatePrice = async (priceId, data) => {

// BAD
// Reading time cannot be negative: the counter feeds the stats
if (readingTime < 0) { return false }

// GOOD
if (readingTime < 0) { return false } // see ADR-xx
```

## Extract a named function when the name teaches

MUST pull a sub-expression into a named internal function when the name clarifies the intent, even if used once. The test is whether the name teaches something the inline expression does not, not the call count. Predicates passed to `filter` / `some` / `every` are the prime case.

```js
// BAD
const visible = chapters.filter(chapter => chapter.isPublished && !chapter.isHidden)

// GOOD
const isVisible = chapter => chapter.isPublished && !chapter.isHidden
const visible = chapters.filter(chapter => isVisible(chapter))
```

## Inline a wrapper that no longer teaches

Once the only caller of a helper disappears in a refactor, a single-use pass-through whose name adds nothing over its expression, and which has no dedicated test, MUST be inlined.

```js
// BAD
const spanInDays = (start, end) => Math.round((new Date(end) - new Date(start)) / MS_PER_DAY)
const isMultiDay = chapter => spanInDays(chapter.openedAt, chapter.closedAt) > 0

// GOOD
const isMultiDay = chapter =>
  Math.round((new Date(chapter.closedAt) - new Date(chapter.openedAt)) / MS_PER_DAY) > 0
```
