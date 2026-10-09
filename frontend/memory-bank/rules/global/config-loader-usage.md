---
paths:
  - "src/config/**/*.js"
  - "src/**/*.vue"
  - "src/**/*.js"
---
# Config Loader Usage

`src/config/config-loader.js` imports every config module and holds them in one `configUser` object (`locales`, `routes`, `routesApi`, `app`, `reading`). `ConfigLoader.get(key)` throws `Key "..." not found`; `find(key, default)` returns the default; `has(key)` tests; `set(path, value)` writes at runtime; `init(configs)` merges namespaces and is not used by the app.

- A config module (`src/config/*-config.js`) MUST be a plain data object, never a service object with methods.
- Only `config-loader.js` MAY import a `*-config.js` module. Any other file reads the value with `ConfigLoader.get('<namespace>.<key>')`, which fails loud on a broken config.
- Use `find` with a default only when the lookup may legitimately miss.
- MUST register a config module in `configUser` before reading it through `ConfigLoader`, and only if a consumer reads it: a dead registration is noise.
- MUST NOT wrap `ConfigLoader.get` / `find` in a helper that only duplicates the lookup.
- MUST NOT read a key at module level when it is written at runtime by `set` / `init`. Namespaces declared statically in `configUser` are available at import time.

```js
// BAD
import { reportConfig } from '@/config/report-config.js'
const maxLength = reportConfig.descriptionMaxLength

// BAD
export const reportConfig = {
  getMaxLength: () => 1000,
}

// GOOD
export const reportConfig = {
  descriptionMaxLength: 1000,
}
const configUser = { app, report: reportConfig }

// GOOD
const maxLength = ConfigLoader.get('report.descriptionMaxLength')
const defaultValue = computed(() => ConfigLoader.find(`reading.${setting.value}.default`, 0))
```
