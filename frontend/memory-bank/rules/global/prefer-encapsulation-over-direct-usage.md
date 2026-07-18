---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Prefer Encapsulation Over Direct Usage

Never use framework or library APIs directly. If a vuemann wrapper exists, use it. If not, create one. The wrapper is the contract — the underlying implementation can change without impacting consumers.

```js
// BAD - coupled to Vue i18n
{{ $t('error_not_found') }}

// GOOD - encapsulated via services-shortcut
import { t } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
{{ t('error_not_found') }}
```

## Accept the helper's narrower API

This applies to vuemann's own internal services, not just external libraries: reach them
through `services-shortcut.js`. If the helper exposes a narrower API than the raw service,
work within it — never import the raw service to recover a missing method.

```js
// BAD - reaching for the raw service to get `resolve`
import { getRouter } from '@brugmann/vuemann/src/services/router/init/router-plugin.js'
const href = getRouter().resolve({ name: 'home', query }).href

// GOOD - stay within the helper's API
import { router } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
router.push({ name: 'home', query })
```

## Translation belongs in the view

Encapsulation also dictates *where* translation runs: pure JS (helpers, DTOs, services) returns an i18n **key** — or a `key:param=value|param2=value2` string vuemann's `t` parses — never a finished translated phrase. Only the view calls `t` (store the key on the entity, e.g. a `ruleFormat` field). Exception: JS may translate an inner sub-token and pass it as a param, as long as the outer phrase stays a key.

```js
// BAD - finished sentence built in pure JS
const formatForHuman = (recurrence) => t('summary.daily', { interval: recurrence.interval })

// GOOD - key|param string; the view translates
const formatForHuman = (recurrence) => `summary.daily:interval=${recurrence.interval}`
// template: {{ t(recurrence.ruleFormat) }}
```
