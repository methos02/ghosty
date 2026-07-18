# Log Service

Centralizes error management. Logs to console + sends to backend API.

`import { log } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

**Dependencies:** auth, router, utils. Requires `log` route in routes-api-config.js.

Disabled in dev by default. Enable: `ConfigLoader.set('app.log', true)`

## Methods

| Method | Console | Backend | Usage |
|--------|---------|---------|-------|
| `log.send(error, context?)` | Yes | Yes (prod or if app.log) | Critical errors to track |
| `log.error(msg, ...args)` | Yes | No | Console errors |
| `log.warn(msg, ...args)` | Yes | No | Warnings |
| `log.info(msg, ...args)` | Yes | No | Info messages |
| `log.debug(msg, ...args)` | Yes | No | Debug messages |

## Backend Payload

`{ date, app, version, user, tabSessionId?, message, stack, ...context }`. Sent with `log: false` to avoid infinite loop.

## Auto-injected context

- `tabSessionId` — UUID v4 of the current tab, sourced from `tabs.tabSessionId()`. The key is **omitted** (not set to `undefined`) when the value can't be resolved, so logs emitted before storage is available stay clean. The call bypasses `servicesM` and reads `sessionStorage` directly, so it works without registering anything in `initServices`.
