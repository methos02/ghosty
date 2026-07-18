# WebSocket Service

Optional service for WS connections with queue system, auto-reconnect, and tab visibility management.

`import { ws } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

**Dependencies:** auth, flash, locale, log, router (the resync banner reads the current route's `meta.ws.reload`). Not included by default — create `websocketInit` and register.

## Configuration

- `app-config.js`: `ws: "false"` disables all WS
- `routes-api-config.js`: WS routes (auto-converts http→ws, https→wss)
- Message format: `{ event: "name", data: {} }`. `ping`/`connected` events handled automatically.

## Methods

- `ws.open(route_name)` — open connection (auto-sends auth token)
- `ws.register(route_name, events)` — register a route's event handlers in one call. `events` = `[{ event, callback }, …]`. Auto-opens if needed. Registering a route also **enrolls it for resync**; closing it unenrolls it — there is no separate resync call.
- `ws.close(route_name)` — close + remove events + unenroll resync (prevents auto-reconnect)
- `ws.get(route_name?)` — get connection(s)
- `ws.exist(route_name)` — check if connection exists
- `ws.clear()` — remove all events from all routes
- `ws.clearQueue(route_name)` — clear message queue
- `ws.lastEvent(route_name)` — `{ at, content }` of the last successfully processed handler call on this route, or `undefined` if none. `at` = epoch ms, `content` = full parsed message (event name + data). Excludes `ping`/`connected` global events and messages blocked while the tab is hidden. Useful at error time to measure WS silence (`Date.now() - ws.lastEvent('chapter').at`) and to expose the last payload received for diagnosis.

## Features

- **Queue**: sequential message processing in arrival order
- **Auto-reconnect**: exponential backoff + jitter with a delay ceiling (~30s max) on unexpected close, retrying indefinitely (not on manual `ws.close()`). Avoids a thundering-herd DoS on a synchronized backend restart
- **Resync banner**: shown **only on a genuine WebSocket problem** — reconnection after an unexpected close, or a handler that threw. A global announced-reload banner (`ResyncBannerComponent`, bottom-left) instead of silently re-fetching under the user
- **Auto-auth**: sends bearer token on open
- **Tab visibility**: blocks processing when tab hidden. On return: 0-1 blocked events → replayed in order; 2+ events → the queue is cleared (replaying many would flood the API) and the page is **silently reloaded** for fresh data — unless the current page opts out with `meta.ws.reload: false`. **No banner** — a tab switch is not a WS problem
- **Message errors**: a handler that throws no longer drops the message silently — it raises the resync banner for its route
- **Errors**: flash messages for unknown routes, duplicate connections, bad JSON, unknown events

## Resync (page-level reload)

Registering a route enrolls it for resync — no separate call. The banner is shown **only on a genuine WebSocket problem**: a socket reconnection after an unexpected close, or a handler that threw. (A tab return is not a problem — see Tab visibility above: it replays or silently reloads, never a banner.) On a real problem, Vuemann shows a **global announced-reload banner** (bottom-left): a 30s countdown then `locationHelper.reload()`, with **Reload now** / **Postpone** (postpone re-arms +30s and is logged). No app callback — Vuemann reloads the whole page.

Both the banner reload and the tab-return silent reload respect `meta.ws.reload: false`: on such a page nothing reloads.

**Opting a page out** — because the reload is global, whether it is safe depends on the **current page**, not the WS route. A page (typically a form) declares in `route-config.js`:

```js
{ path: '/create/user', name: 'user.create', component: ..., meta: { ws: { reload: false } } }
```

On a `meta.ws.reload === false` page, a resync does **nothing** (no banner, no reload) — the data refreshes naturally on the next navigation, so an in-progress form is never lost.

Banner-shown and postpone are logged (`resync_banner_shown` / `resync_postponed`, with the username) for observability.

## Reference wiring

```js
import { onMounted, onUnmounted } from 'vue'
import { ws } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'

onMounted(() => {
  ws.register('chapter.ws', [
    { event: 'chapter_updated', callback: handleUpdated },
    { event: 'chapter_created', callback: handleCreated },
  ])
})

onUnmounted(() => {
  ws.close('chapter.ws')   // closes + unenrolls resync
})
```

## Best Practices

- Close in `onUnmounted`: `ws.close('route.ws')` (also unenrolls resync — no separate cleanup)
- Add `meta: { ws: { reload: false } }` to form pages (or any page where a reload would lose work) so a desync never reloads under the user
- Update UI only via WS events, not in API request callbacks (single source of truth)
