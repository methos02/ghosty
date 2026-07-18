# Form Service

`import { form } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

**Dependencies:** flash, locale

## Validation

FormRequest file defines rules per input. Pass rules + data to `validateForm`.

### Rules Object

Per input: `{ rules: 'required|date:yyyy-mm-dd', format?: (datas) => formattedValue, tests?: { custom_test: (value, datas) => 'error_key' | '' }, errors?: { test_name: 'translation_key' } }`

Reserved key: `global_tests`

### Predefined Rules

Chain with `|`: `'required|date:yyyy-mm-dd'`. Params after `:`.

| Rule | Description | Example |
|------|-------------|---------|
| `required` | Field must not be empty | `'required'` |
| `in` | Value must be in list | `'in:a,b,c'` |
| `date` | Valid date | `'date:yyyy-mm-dd'` |
| `datePast` | Date in the past or today | `'datePast:yyyy-mm-dd'` |
| `dateFutur` | Date in the future or today | `'dateFutur:yyyy-mm-dd'` |
| `dateStrictPast` | Date strictly in the past | `'dateStrictPast:yyyy-mm-dd'` |
| `dateStrictFutur` | Date strictly in the future | `'dateStrictFutur:yyyy-mm-dd'` |
| `niss` | Belgian NISS number (11 digits) | `'niss'` |
| `biss` | Belgian BIS number (11 digits) | `'biss'` |
| `inami` | Belgian INAMI number (11 digits, mod97/mod89 check) | `'inami'` |
| `passport` | Belgian passport (2 letters + 7 digits) | `'passport'` |
| `integer` | Integer only | `'integer'` |
| `positive` | Positive integer | `'positive'` |
| `min` | Minimum value | `'min:5'` |
| `max` | Maximum value | `'max:100'` |
| `size` | Exact string length | `'size:11'` |
| `sizeMin` | Minimum string length | `'sizeMin:3'` |
| `sizeMax` | Maximum string length | `'sizeMax:50'` |
| `email` | Valid email format | `'email'` |

### Custom Tests

In `tests` property: `(value, datas) => 'test_name' | ''`. Return test name on fail (maps to `errors` for translation key).

### Global Tests

`global_tests: [(datas) => errorMsg | '']` — validate cross-field logic. Errors stored under `global_tests` key.

### Data Formatting

1. Modify datas before `validateForm`
2. Use `format: (datas) => value` per rule (doesn't modify original)

### Sanitization via datas

`form.validate` returns the exact object passed as second argument via the `datas` field. To sanitize form data (strip masks, trim, normalize) before it reaches the DTO without mutating the reactive v-model, build a copy inside the FormRequest and let the caller consume it via `validation.datas`:

```javascript
const sanitize = (formData) => ({
  ...formData,
  niss: typeof formData.niss === 'string' ? formData.niss.replaceAll(/\D/g, '') : formData.niss
})

const validate = (formData, context) => {
  const sanitized = sanitize(formData)
  const rules = { /* ... */ }
  return form.validate(rules, sanitized)
}

export const XxxFormRequest = { validate }
export const XxxFormRequestInternal = { sanitize }
```

Caller:

```javascript
const validation = XxxFormRequest.validate(formData.value, context)
if (!validation.valid) { return }
await XxxController.update(validation.datas)
```

**Never mutate `formData` in place** when the form uses directives like `vMaska` — the directive observes the v-model and re-applies its mask when the value changes, reverting the cleanup. Always return a new object.

## Methods

- `form.validate(rules, datas, options?)` → `{ valid: bool, datas: object, errors: object }`
  - options: `{ form: string }` — prefixes input/error names
- `form.getErrors()`, `form.getError(name)`, `form.hasError(name)`
- `form.addError(name, error)`, `form.clearError(name)`, `form.clearErrors()`

## Error Display

`import ErrorFormComponent from '@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue'`

Auto-included in all form service inputs:
- `InputComponent`
- `InputDateComponent` (dedicated date input with calendar popup — use this instead of `InputComponent type="date"`, set `dateFormat="YYYY-MM-DD"` if the value is consumed as ISO prefix; use `initialViewDate="YYYY-MM-DD"` to set the month/year the calendar opens on when no date is pre-selected — useful with a `maxDate` in the past to avoid forcing the user to scroll back many years)
- `InputSearchComponent`
- `SelectComponent`
- `SwitchComponent`
- `TextareaComponent`

**Constraint:** the input's `name` prop MUST match the form-request rule key — otherwise the auto-embedded `ErrorFormComponent` cannot retrieve the error from `formStore`.

Manual `<ErrorFormComponent name="..." />` only for: `global_tests`, custom errors, native HTML fields.

**Props:** `name` (required), `error` (optional string override). Does NOT accept `field` or an `errors` object — reads from `formStore.getError(name)` automatically.

### Validation submit pattern

```js
const validation = myFormRequest.validate(formData.value)
if (!validation.valid) { return }
// proceed with submission
```

BAD — `hasErrors` does not exist on the return:
```js
if (validation.hasErrors) { return }
```

BAD — mismatched input name, manual ErrorFormComponent added as workaround:
```vue
<InputComponent name="availability_start_date" v-model="formData.startDate" />
<ErrorFormComponent name="startDate" />
```

GOOD — input name matches rule key, error auto-displays:
```vue
<InputComponent name="startDate" v-model="formData.startDate" />
```
