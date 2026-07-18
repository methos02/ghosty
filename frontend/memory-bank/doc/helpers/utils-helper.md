# Utils Helper

`import { utilsH } from '@brugmann/vuemann/src/helpers/utils-helper.js'`

- `getGenreIconClass(genre)` — 'M' → 'fa-solid fa-mars', 'F' → 'fa-solid fa-venus', other → 'fa-solid fa-neuter'
- `isRecursivelyIncluded(subset, object)` — deep check if subset is in object (boolean)
- `copyObject(object)` — deep copy via structuredClone (JSON fallback)
- `percentOf(part, total)` — percentage calculation
- `getNestedProperty(object, key)` — dot notation access ('profile.address.city')
- `voidToEmpty(data, exclude = [])` — replaces `null`/`undefined` with `''` on all keys of `data`. Keys in `exclude` keep their raw value. Only processes existing keys.
- `voidToNull(value)` — returns `value ?? null`. Centralizes the `unicorn/no-null` eslint disable so callers don't repeat it. Calling with no argument returns `null`.
