# tabs-helper

`import { tabsHelper } from '@brugmann/vuemann/src/helpers/tabs-helper.js'`

Pure helper — no service runtime required.

## API

- `tabsHelper.tabSessionId()` — UUID v4 of the current browser tab. Generated lazily on first call from `crypto.getRandomValues` (works outside secure contexts, unlike `crypto.randomUUID`) and persisted in `sessionStorage`. Same value across reloads of the same tab; cleared when the tab closes.

## Usage

```js
import { tabsHelper } from '@brugmann/vuemann/src/helpers/tabs-helper.js'

const id = tabsHelper.tabSessionId()
```

See also: [tabs service](../services/tabs.md) for the cross-tab registry (`tabs.list()`).
