# Tabs Service

`import { tabs } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

**Dependencies:** none

Cross-tab registry of same-origin tabs of the application, backed by `localStorage`. Each tab self-registers on `setup` and unregisters on `pagehide`. Tabs do **not** message each other — the registry is a shared store, not a communication channel.

Designed for lightweight coordination (e.g. dedupe an OS notification when several tabs are open) and telemetry (correlate logs across tabs).

## Methods

- `tabs.list()` — snapshot array of `{ tabId }` for all registered tabs (current one included). Reads `localStorage` on each call. Use `tabs.list().length` when only the count is needed.

See also: [`tabsHelper.tabSessionId()`](../helpers/tabs-helper.md) — pure helper for the current tab UUID, importable without the tabs service.

## Lifecycle

- `setup` self-registers the current `tabsHelper.tabSessionId()` in `localStorage` under key `vuemann.tabs` and adds a `pagehide` listener.
- On `pagehide` the service removes its entry from the registry.

## Tab session id

`tabsHelper.tabSessionId()` is a pure helper — import it from `@brugmann/vuemann/src/helpers/tabs-helper.js`. It returns a UUID v4 identifying the current browser tab, persisted in `sessionStorage`. Works independently of the `tabs` service. See [tabs-helper](../helpers/tabs-helper.md).

## Limitations

- **Stale entries on hard kill**: `pagehide` is not guaranteed to fire when the browser process is killed (e.g. mobile OS background-killing the page, browser crash). The dead tabId stays in `localStorage` until something cleans it. No heartbeat is shipped — accepted trade-off for simplicity.
- **Shared `localStorage`**: same-origin only. Tabs in different origins, browser profiles, or incognito windows are invisible to each other.
- **Race conditions on concurrent writes**: two tabs registering at the exact same moment can clobber each other's update (read-modify-write race). Acceptable for the dedup / telemetry use cases — the next register/unregister will reconverge.

## Auto-injected log context

`LogDto.toCreate` reads `tabsHelper.tabSessionId()` and adds it to every log entry as `tabSessionId`. The cross-tab count is **not** auto-injected — call sites that want it pass it through `context`:

```javascript
import { log, tabs } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'

log.send(error, { tabsAlive: tabs.list().length })
```
