---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Multiline Object Literal

An object literal of 3+ properties breaks one property per line, braces on their own lines, so every item is visible without scrolling. 1-2 properties stay inline.

Count-driven, unlike [no-compact-patterns](no-compact-patterns.md), which is complexity-driven: a 3-property literal of trivial values (`{ id, label, value }`) breaks here even though that rule leaves it alone.

```js
// BAD - items hidden past the right edge
ConfigLoader.init({ routes, app: appConfig, routesApi, resource: resourceConfig })

// GOOD
ConfigLoader.init({
  routes,
  app: appConfig,
  routesApi,
  resource: resourceConfig,
})
```

This is about line-wrapping, not extraction: the literal stays at the call site. Do not hoist it into a named `const` — the name would only restate the function's.

## Enforcement

Machine-enforced, no longer a review burden ([ADR-010](../../decisions/ADR-010-prettier-formatage.md)):

- `local/multiline-object-literal` (ESLint, `eslint-rules/multiline-object-literal.js`) reports the 3+ threshold and auto-fixes it by inserting the line breaks.
- Prettier reindents. It cannot enforce the threshold itself — `objectWrap: "preserve"` keeps a hand-broken object broken, but never breaks an inline one.

Run `npm run lint -- --fix && npm run format` to apply both.

Scope: object **literals** only. Destructuring (`const { one, two, three } = value`) and import specifiers are untouched, as are Vue template expressions. When the object holds a comment, the rule reports without auto-fixing — rewriting the gaps would delete the comment.

## Arrays are deliberately excluded

An array of 3+ elements does **not** break. Prettier collapses any array that fits inside `printWidth`, and — unlike objects — offers no `preserve` option for them. An ESLint rule breaking arrays would be collapsed back by `prettier --write` on every run, so the behaviour is not merely unenforced, it is unenforceable while Prettier owns formatting.

```js
// stays inline - expected, not a violation
const voidTags = ['img', 'input', 'br', 'hr', 'meta', 'link']
plugins: [localeVite(__dirname), vuemannVite(__dirname), vue()]
```

This is also the right outcome. The rule exists so every item of a **config surface** stays visible: an object's 4 properties are 4 distinct named knobs. An array is usually one concept spread over N homogeneous values — one per line makes it harder to read, not easier.
