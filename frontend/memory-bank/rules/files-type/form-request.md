---
paths:
  - "src/**/formRequest/**/*.js"
---
# Form Request Rules

The form request is the input-layer. It validates `formData` against a `rules` object via `form.validate()` and returns `{ valid, errors }`. **Synchronous and pure. Single source of truth for validation** — never duplicate in a service, controller, or computed.

`validate()` may also mutate `formData` to **inject fixed business constants** (e.g., a `statusId` imposed by usage context). This keeps the controller pure and avoids scattering business semantics downstream.

```js
// GOOD - business constant injected in validate, controller stays pure
import { form } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { novelConfig } from '@/config/novel-config.js'

const rules = {
    authorId: { rules: 'required' },
    startDate: { rules: 'required' },
}

const validate = (formData) => {
    formData.statusId = novelConfig.status.draftId
    return form.validate(rules, formData)
}

export const novelSearchFormRequest = { validate }

// BAD - business constant in controller = business semantics leak
const search = async (formData) => {
    const params = NovelDto.toSearchParams({
        ...formData,
        statusId: novelConfig.status.draftId,
    })
    // ...
}
```

## Forbidden

- **Async or network side-effects in `validate()`** — synchronous only, except local `formData` enrichment.
- **Duplicate validation rules** in a service (`hasActiveFilters`) or computed (`canSearch`). See [no-passthrough-layers.md](../global/no-passthrough-layers.md).
