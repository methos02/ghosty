---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Prefer Defaults Over Guards

Set default values at declaration (DTOs, refs, parameters) so consumers don't need guard clauses. Exception: `to{Action}` DTOs receive FormRequest-validated data — defaults are redundant. When guards are unavoidable, order early returns so subsequent code can safely access properties without optional chaining.

## Defaults at source

```js
// from{Action} DTO - defaults for untrusted API data
export const userDto = (user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname ?? '',
    groups: user.groups ?? [],
    settings: user.settings ?? {}
})

// refs - initialize with typed defaults; never ref(undefined) — ref() is equivalent
const users = ref([])
const config = ref({ timeout: 5000 })
const form = ref({})
const selectedUser = ref()  // OK

// function parameters - use domain names, not generic "items"
const processSites = (sites = []) => {
    sites.forEach(process)
}
```

## State factories

When a factory builds a default state (filters, form state, search state), guarantee container existence and omit scalars. Containers (`{}`, `[]`) must always be present so consumers access without `?.`. Scalars are omitted — accessing a missing key returns `undefined` naturally, so listing `key: undefined` is noise.

```js
// GOOD - containers present, scalars omitted
const createDefaultFilters = () => ({
    searchType: 'location',     // meaningful default kept
    location: {},                // container always present
    route: {},
    attributes: [],              // array always present
    availability: {}
})

// BAD - redundant explicit undefined, mixed '' / undefined for scalars
const createDefaultFilters = () => ({
    searchType: 'location',
    location: { siteId: undefined, locationId: undefined },
    route: { id: undefined, label: '' },
    attributes: [],
    availability: { status: undefined, startDate: '' },
    resourceTypeId: undefined    // accessed → undefined either way
})
```

**Consumer side**: when a function reads directly from such a store (or its argument is typed/documented as the store shape), drop the `?.` on container access. The factory is the contract — trust it. `?.` stays justified only at system boundaries (API responses, query strings, optional injects, props with no default).

```js
// GOOD - filters comes from the store, container shape is guaranteed
const hasLocationFilter = (filters) => filters.location.locationId || filters.location.siteId

// BAD - defensive ?. masks the store contract
const hasLocationFilter = (filters) => filters.location?.locationId || filters.location?.siteId
```

## Early return ordering

```js
// BAD - optional chaining needed because response not yet validated
const manageError = async (error) => {
    if (options.empty404 && error.response?.status === 404) {
        return { data: [], status: 200 }
    }
    if (error.response === undefined) { return { data: {error: 'error_server'}, status: 500 } }
}

// GOOD - validate response first, then safely access .status
const manageError = async (error) => {
    if (error.response === undefined) { return { data: {error: 'error_server'}, status: 500 } }
    if (options.empty404 && error.response.status === 404) {
        return { data: [], status: 200 }
    }
}
```

## Don't re-check upstream guards

When a condition is already guaranteed by a parent guard (button hidden by `v-if`, protected route, form validator blocking submission), don't re-check it downstream with a fallback. Dead defensive code rots silently when the upstream guard changes.

```js
// BAD - the dialog reimplements the "not in the past" rule
// that the parent already enforces via v-if="canStopRecurrence"
const open = () => {
    const today = new Date().toISOString().split('T')[0]
    const occupationDate = occupation.value.startAt.split('T')[0]
    const [, chosenDate] = [today, occupationDate].toSorted()
    formDatas.value = { chosenDate }
    dialog.value.show()
}

// GOOD - trust the parent guard, prefill the raw value
const open = () => {
    formDatas.value = { chosenDate: occupation.value.startAt.split('T')[0] }
    dialog.value.show()
}
```

Guards acceptable at: system boundaries (user input, API errors), business logic, DOM template refs.
