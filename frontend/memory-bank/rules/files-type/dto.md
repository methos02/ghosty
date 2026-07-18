---
paths:
  - "src/**/dtos/**/*.js"
---
# DTO Rules

Group related properties into sub-objects. Use camelCase for all properties. `from{Action}`: provide defaults (`?? []`, `?? ''`) — API data is untrusted. `to{Action}`: use validated fields directly — FormRequest guarantees required fields.

`from{Action}` must only map fields present in the API response. Never add fields the API does not provide.

Defaults apply to values that are present but `null`/`undefined`. A missing key means the API contract changed — crash, never silently default.

## Naming

Use the **API action name** as suffix — never generic names like `fromApi` or `toApi`.

- `from{Action}` -- API response to frontend: `fromShow`, `fromList`, `fromIndex`, `fromRead`, `fromSearch`
- `to{Action}` -- frontend data to API format: `toCreate`, `toUpdate`, `toFilter`, `toSearch`
- `toForm{Action}` -- stored entity to form-input shape (internal, no API boundary): `toFormManage`, `toFormEdit`

Two naming clarifications:

- **No `Api` suffix on `to{Action}` methods.** Every `to{Action}` already produces an API payload by definition — the suffix is redundant. `toBulkFromRecurrenceApi` → `toBulkFromRecurrence`.
- **Specific name when an argument shapes the method's behaviour.** When a method's output is materially shaped by an entity passed as an extra argument, encode that entity in the name rather than hiding it as context. `fromSearch(data, author)` → `fromSearchByAuthor(data, author)`.
- **`from{Action}` parameter is named `data`** (the raw API payload); the plural `from{Action}s` takes **`datas`**. Never name the param after the entity (`position`, `unit`, `user`). `to{Action}` / `toForm{Action}` keep semantic names (`formData`, `occupation`). When extra domain context is passed, only the first (payload) param is `data`; the rest stay semantic — see *Specific name when an argument shapes the method's behaviour* above.

`to{Action}` covers **only the frontend-form → API direction**. For entity → form transformations (input is a stored entity, output is a form-shape consumed by a form composable), use `toForm{Action}`. Example: `toFormManage(occupation)` returns the form-data shape used to edit an existing occupation. Defaults are required on `toForm{Action}` because the input is NOT FormRequest-validated (unlike `to{Action}`).

```js
// GOOD - from{Action}: defaults for untrusted API data
const fromShow = (data) => ({
  id: data.position_id,
  department: {
    id: data.organisation_unit?.id,
    name: data.organisation_unit?.name
  },
  function: data.function?.name,
  tags: data.tags ?? []
})

// GOOD - to{Action}: validated data, no redundant defaults
const toCreate = (formData) => ({
  surname: formData.officialLastname,
  birthdate: formData.birthdate,
  gender: formData.gender,
  phone: formData.phone
})

// BAD - generic name "fromApi"
const fromApi = (data) => ({
  id: data.position_id,
  department: data.organisation_unit?.name,
  departmentId: data.organisation_unit?.id
})

// BAD - redundant defaults on validated data (inflates complexity)
const toCreate = (formData) => ({
  surname: formData.officialLastname ?? '',
  birthdate: formData.birthdate ?? '',
  gender: formData.gender ?? ''
})
```

## Spread Base Shape + Sidecar Metadata

When extending a base DTO via `...fromShow(data)`, never replace an entire array or object field from the base — enrich via a **sidecar key** instead. The base output is the canonical shape; partial overrides corrupt downstream consumers that expect the original entries, and produce half-hydrated arrays where consumers cannot tell which entries are enriched and why.

This applies in particular to search/filter results that need to expose "by which entity did this filter run?" — that metadata gets its own key, never inside the data array.

```js
// BAD - overwrites the authors array, losing every entry except the searched one
// and produces a half-hydrated array (one entry rich, others bare ids)
const fromSearchByAuthor = (data, author) => ({
  ...fromShow(data),
  authors: [{ id: author.id, nameFormat: author.nameFormat }]
})
// Input author_ids: [5, 7, 12], searched=5 → output drops 7 and 12

// GOOD - canonical array stays uniform from the spread, searched entity in its own sidecar key
const fromSearchByAuthor = (data, author) => ({
  ...fromShow(data),                              // authors: [{id:5},{id:7},{id:12}]
  searchedAuthor: {
    id: author.id,
    nameFormat: author.nameFormat
  }
})
```

## Default Values

Two helpers cover the `null`/`undefined` cases. Pick by direction and intent.

### `from{Action}` → `utilsH.voidToEmpty`

Use `utilsH.voidToEmpty(data, exclude)` to replace `null`/`undefined` with `''` on all keys instead of `?? ''` per field. Only keys **present** in `data` are processed — missing keys are not invented. Use `exclude` for non-string types (IDs, booleans, arrays, dates).

```js
// GOOD - centralized defaults, single source (safe)
import { utilsH } from '@brugmann/vuemann/src/helpers/utils-helper.js'

const fromShow = (data) => {
  const safe = utilsH.voidToEmpty(data, ['id', 'tags'])
  return {
    id: safe.id,
    name: safe.name,
    department: safe.department,
    tags: safe.tags ?? []
  }
}

// BAD - repetitive ?? '' on every field
const fromShow = (data) => ({
  id: data.id,
  name: data.name ?? '',
  department: data.department ?? '',
  tags: data.tags ?? []
})
```

### `to{Action}` clearable field → `utilsH.voidToNull`

`to{Action}` does **not** add defaults on validated data (see top of file). The single exception: a **clearable field** where the API requires an explicit `null` to clear the value (vs. `''` or omission). In that case, use `utilsH.voidToNull(value)` — it centralizes the `unicorn/no-null` eslint disable.

Do not use `voidToNull` as a generic fallback — it is only for the clear-field contract. Empty strings or omission are the default for non-clearable fields.

```js
// GOOD - clearable field, API expects null to clear
const toUpdate = (formData) => ({
  surname: formData.officialLastname,
  birthdate: formData.birthdate,
  notes: utilsH.voidToNull(formData.notes)  // null clears the field server-side
})

// BAD - voidToNull on a non-clearable field, adds noise
const toCreate = (formData) => ({
  surname: utilsH.voidToNull(formData.officialLastname),
  birthdate: utilsH.voidToNull(formData.birthdate)
})
```

## Trust ajax cleanup for `undefined`

Vuemann's ajax layer drops `undefined` at serialization time on both sides: `JSON.stringify` omits `undefined` object values for JSON bodies, and `customParamsSerializer` (`src/services/ajax/src/models/http-client.js`) skips `undefined` query params. Do **not** wrap `to{Action}` payload assignments in `if (value !== undefined)` guards — the wire payload is identical, the guard is dead code.

```js
// BAD - manual undefined guard, redundant with ajax cleanup
const toSearch = (filters) => {
  const payload = buildBase(filters)
  if (filters.resourceTypeId !== undefined) {
    payload.resource_type_id = filters.resourceTypeId
  }
  return payload
}

// GOOD - direct assignment, ajax drops the key when undefined
const toSearch = (filters) => ({
  ...buildBase(filters),
  resource_type_id: filters.resourceTypeId
})
```

Exception: if a test asserts strict object equality on the payload, fix the test (compare only required keys) rather than reintroducing the guard.

## Raw Value + Formatted Display Pair

When a field needs both a raw value (for forms, payloads, downstream DTOs) and a formatted version (for display), expose two fields: `x` (raw) and `xFormat` (formatted). Put the display sentinel (`'-'`) on `xFormat` only — never on the raw.

The raw stays `undefined`/empty when missing so downstream form DTOs (e.g. `fromEdit` reading from `fromShow` output) don't inherit the sentinel as a real form value.

```js
// GOOD - raw and format separated, sentinel on format only
const fromAd = (data) => {
  const language = LanguageService.getByValue(data.preferredLanguage)
  return {
    language: data.preferredLanguage,       // raw, may be undefined
    languageFormat: language?.label || '-'  // formatted with sentinel
  }
}

// BAD - sentinel on the raw field, cascades into forms
const fromAd = (data) => ({
  language: LanguageService.getByValue(data.preferredLanguage)?.label || '-'
})
```

Established instances of the `xFormat` convention: `createdAtFormat`, `updatedAtFormat`, `adSyncDateFormat`, `exchangeSyncDateFormat`.

## Plural Methods

Create a plural method that maps through the singular one. The calling layer (controller **or** service) calls the plural on the whole array — never loop and call singular per item.

```js
// GOOD - plural DTO method
const fromSearch = (data) => ({
  id: data.id,
  name: data.name,
  parent: data.parent_organisation_unit_id ? { id: data.parent_organisation_unit_id } : undefined
})

const fromSearches = (datas) => datas.map(data => fromSearch(data))

// BAD - singular DTO in controller loop
for (const unitApi of response.data) {
  const unit = Dto.fromSearch(unitApi)
  units.push(unit)
}

// GOOD - plural DTO call in controller
const units = Dto.fromSearches(response.data)
```

## Display formatting belongs in the DTO

Any user-facing display transformation (date formatting, casing, joining names, conditional placeholders) belongs in `from{Action}`, not in a per-component helper. Components must render the value as-is without inline `displayValue`/`formatX` helpers.

```js
// BAD - per-component display helper
// arno-component.vue
const displayValue = (v) => FormHelper.isEmpty(v) ? '-' : v
// template: {{ displayValue(currentUser.arno.lastname) }}

// GOOD - DTO returns display-ready data
// arno-dto.js
const fromShow = (data) => ({
  lastname: data.lastname,
  dateBorn: data.date_born ? dateHelper.formatDate(data.date_born) : void 0,
  ...
})
// template: {{ currentUser.arno.lastname }}
```

## Default list ordering belongs in the DTO

A list's **default** order is a pure transformation, so it belongs in the `from{Action}s` mapper (delegating to a helper), not in the store, composable, or view. Every consumer then receives the same already-ordered data from one place.

This sets the default, not a lock: a consumer with its own ordering need (a table column the user sorts, a per-view ranking) overrides locally — it does not push that concern back into the DTO.

```js
// BAD - default order applied in the store mutation or a view computed
setAll = (units) => { organisationUnits.value = units.toSorted(byName) }

// GOOD - default order in the DTO list mapper, via a helper
const fromIndex = (datas) => OrganisationUnitHelper.orderByName((datas ?? []).map(fromShow))
```

## No defensive fallbacks for required fields

Trust the backend contract. Fields the API contractually guarantees as required (e.g. primary identifiers, names) must NOT be wrapped in `?? ''`, `displayValue('-')`, or similar fallbacks. Defensive fallbacks hide real contract regressions and create dead code.

Defaults still apply to **legitimately optional** fields (dates, optional nested resources, arrays). The rule is: default the optional, never the guaranteed.

```js
// BAD - defensive '-' on fields the API always returns
const fromShow = (data) => ({
  firstname: data.firstname ?? '-',
  lastname: data.lastname ?? '-',
  matricule: data.matricule ?? '-'
})

// GOOD - trust the contract for required fields, default only the optional ones
const fromShow = (data) => ({
  firstname: data.firstname,
  lastname: data.lastname,
  matricule: data.matricule,
  dateBorn: dateHelper.formatDate(data.date_born),
  contrats: data.contrats?.map(fromShowContract) || []
})
```

## Don't Defensively Polymorph Documented Types

The "API data is untrusted, provide defaults" guidance applies to **nullable values** (a field that may be `null`/missing in a `from{Action}` DTO). It does NOT apply to **documented shapes**: if the API doc says a field is always an array, code as if it's always an array — no `Array.isArray()` polymorphism, no scalar-to-array fallback.

Defensive polymorphism inflates the surface, duplicates the same intent at every consumer, and silently signals doubt about the contract. If the API genuinely returns inconsistent shapes, fix the API or document the polymorphism explicitly in the contract — never paper over it in the DTO.

This is distinct from the "no defensive fallbacks for required fields" rule above: that rule forbids `?? '-'` on guaranteed scalars; this rule forbids `Array.isArray()` branches on guaranteed arrays.

```js
// Doc says: author_ids is always an array (possibly empty)

// BAD - defensive polymorphism for a documented type
const fromShow = (data) => ({
  authorIds: Array.isArray(data.author_ids)
    ? data.author_ids
    : (data.author_ids ? [data.author_ids] : [])
})

// GOOD - trust the contract; default only for the nullable case
const fromShow = (data) => ({
  authorIds: data.author_ids ?? []
})
```
