---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Prefer Vuemann Helpers

Always use Vuemann helpers instead of manual checks or custom implementations.

```js
// BAD - manual empty check
hasValue: boxAttribute !== undefined && boxAttribute.value !== null && boxAttribute.value !== ''
// GOOD
import { FormHelper } from '@brugmann/vuemann/src/helpers/form-helper.js'
hasValue: !FormHelper.isEmpty(boxAttribute)

// BAD - manual date formatting
const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
// GOOD
import { dateHelper } from '@brugmann/vuemann/src/helpers/date-helper.js'
const formatted = dateHelper.formatDate(date, 'DD/MM/YYYY')

// BAD - JSON trick (fails with dates, functions, undefined)
const copy = JSON.parse(JSON.stringify(original))
// GOOD
import { utilsH } from '@brugmann/vuemann/src/helpers/utils-helper.js'
const copy = utilsH.copyObject(original)

// BAD - direct console usage (bypasses log service, requires eslint-disable)
console.error('API unreachable')
// GOOD
import { log } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
log.error('API unreachable')

```

**Exception**: `log-service.js` is the only file allowed to use `console` directly (it's the underlying implementation).

See `CLAUDE.md` Helpers section for full list.
