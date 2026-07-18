# ConfigLoader

`import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'`

- `ConfigLoader.init(configs)` — initialize with config object
- `ConfigLoader.set(name, value)` — set value (dot notation: `'app.name'`)
- `ConfigLoader.get(name)` — strict get, throws Error if key missing
- `ConfigLoader.find(name, defaultValue?)` — safe get, returns undefined/default if missing
- `ConfigLoader.has(name)` — check existence (boolean)
- `ConfigLoader.getAll()` — all configs object
