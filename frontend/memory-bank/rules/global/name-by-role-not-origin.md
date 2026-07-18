---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Name By Role, Not Origin

Name a variable, ref, param or function after its **intrinsic role** — the effect it controls, the job it does — never after the incidental context that motivates it today (the trigger that sets it, the caller that supplies it). An incidental name starts lying the moment a second trigger or source appears, forcing a rename of code whose behavior never changed.

Confine the incidental context to the single line that decides it — e.g. a new contra-indication becomes `&& !otherCondition` there, no downstream rename. Booleans keep their `is/has/should/...` prefix (`unicorn/consistent-boolean-name`).

```js
// BAD - flag named after its trigger; every derived name inherits "huderf"
const isHuderf = auth.hasRole('huderf')
const completeHuderfCreation = () => { ... }
dialog.show({ huderf: isHuderf })

// GOOD - flag named after the effect it controls; the trigger appears once
const shouldRunGumsSteps = !auth.hasRole('huderf')
const completeCreationWithoutGums = () => { ... }
dialog.show(shouldRunGumsSteps)
```

Same principle for params of reusable helpers: name them after the role they play *inside* the function, not after where the value comes from at the only current call site.

```js
// BAD - generic builder named after its only current caller
const buildCreationResult = (samaccountname, gumsErrors) => { ... }

// GOOD - param named after its role in the function
const buildCreationResult = (samaccountname, errors) => { ... }
```

The source-specific name stays correct at the orchestrator/call site, where sources are composed: `buildCreationResult(samaccountname, [...gumsErrors, ...pdfErrors])`.

## Domain term over term of art

Prefer the word a domain reader recognizes over the algorithmic term of art, even when the latter is standard in the literature. And check the name covers **everything** the thing does — a name matching only a subset of the behaviour (`planning-style-helper` for a file that also builds tooltip text and line counts) misleads today and lies outright as soon as the file grows.

```js
// BAD - "cluster" is the standard calendar-layout term; it means nothing in the business
const clusters = buildClusters(occupations)

// GOOD - the domain word: a continuous stretch where the resource is taken
const occupiedPeriods = buildOccupiedPeriods(occupations)
```
