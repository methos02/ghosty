# Location Helper

`import { locationHelper } from '@brugmann/vuemann/src/helpers/location-helper.js'`

Encapsulates `globalThis.location` access so callers stay decoupled from the browser API and tests can mock individual methods via `vi.spyOn(locationHelper, ...)` instead of hacking `globalThis.location`.

- `getHash()` — current URL hash (`location.hash`)
- `getPathname()` — current URL pathname (`location.pathname`)
- `getSearch()` — current URL query string (`location.search`)
- `reload()` — reload the current page (`location.reload()`)
- `setHref(url)` — navigate to `url` (`location.href = url`)
