---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Keep It Simple and Readable

Prefer straightforward solutions over clever patterns. If a reader can't tell what problem is being solved, the code has failed.

```js
// BAD - intent hidden (handling undefined prefix_name via filter)
const nameParts = [data.prefix_name, data.family_name, data.given_name]
return { nameFormat: nameParts.filter(Boolean).join(' ') }

// GOOD - edge case made explicit
return {
    nameFormat: data.prefix_name
        ? `${data.prefix_name} ${data.family_name} ${data.given_name}`
        : `${data.family_name} ${data.given_name}`
}

// BAD - spread operator gymnastics
const config = {
    ...baseConfig,
    ...(enableFeature && { feature: true }),
    ...(customValue !== undefined && { custom: customValue })
}

// GOOD - explicit
const config = { ...baseConfig }
if (enableFeature) { config.feature = true }
if (customValue !== undefined) { config.custom = customValue }
```

"Clever" acceptable when: well-known codebase idiom, measured performance need, or alternative is significantly more verbose without being clearer.

## Don't catch exceptions that won't fire

A try/catch is a guard against a specific exception path. Adding one against an exception that doesn't realistically occur in the supported runtime hides real bugs behind a silent fallback when the assumption breaks.

Verify that the wrapped call can actually throw in the target environment (browser version, network context, sandboxing) before adding a catch. If it can't, let the exception surface so a future regression is visible.

```js
// BAD - sessionStorage and crypto.randomUUID don't throw in supported browsers,
// the catch would only silence an unrelated future bug
const id = () => {
    try {
        const existing = sessionStorage.getItem(KEY)
        if (existing) { return existing }
        const generated = crypto.randomUUID()
        sessionStorage.setItem(KEY, generated)
        return generated
    } catch {
        return ''
    }
}

// GOOD - direct, lets unexpected exceptions propagate to the error reporter
const id = () => {
    const existing = sessionStorage.getItem(KEY)
    if (existing) { return existing }
    const generated = crypto.randomUUID()
    sessionStorage.setItem(KEY, generated)
    return generated
}
```

Acceptable: try/catch at system boundaries (user input parsing, third-party SDK calls, external API responses) where the throw path is documented and reachable.
