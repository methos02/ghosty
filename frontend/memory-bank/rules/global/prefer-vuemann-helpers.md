---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Prefer Vuemann Helpers

MUST use the existing helper (`src/core/helpers/`, documented in `memory-bank/doc/helpers/`) instead of a manual check or a custom implementation.

```js
// BAD
const hasValue = summary !== undefined && summary !== null && summary !== ''
// GOOD
import { FormHelper } from '@/core/helpers/form-helper.js'
const hasValue = !FormHelper.isEmpty(summary)

// BAD
const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
// GOOD
import { dateHelper } from '@/core/helpers/date-helper.js'
const formatted = dateHelper.formatDate(date, 'DD/MM/YYYY')

// BAD
const copy = JSON.parse(JSON.stringify(original))
// GOOD
import { utilsH } from '@/core/helpers/utils-helper.js'
const copy = utilsH.copyObject(original)

// BAD
console.error('API unreachable')
// GOOD
import { log } from '@/services/shortcuts/services-shortcut.js'
log.error('API unreachable')
```

Exception: `src/services/shortcuts/log-shortcut.js` is the only file allowed to use `console` (the `no-console` ESLint rule is a warning and covers the rest).
