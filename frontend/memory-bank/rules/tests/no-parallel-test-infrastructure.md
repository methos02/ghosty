---
paths:
  - "tests/**/*.test.js"
---
# No Parallel Test Infrastructure

Tests use the infrastructure booted by `vitest.setup.js` (services via `servicesBoot.bootServicesOnce()`, global router via `routerPlugin.createAppRouter({ ssr: true })`, translator, `configureTestUtils()` with its `router-link` stub). MUST NOT build local substitutes that shadow it. If something is missing, extend `vitest.setup.js` or `tests/utils/test-utils-config.js`, or register the missing piece locally.

| Violation | Fix |
|---|---|
| `createRouter(...)` in a test file | Use the global router; add a route with `routerService.addRoute(...)` in `beforeAll` |
| A literal string passed to `t()` or used as an i18n key | Use a real key of `src/locales/fr/`; add the key to the matching locale file if absent |

```js
// BAD
const router = createRouter({ history: createWebHistory(), routes: [...] })
const wrapper = mount(NotificationsPage, { global: { plugins: [router] } })

// GOOD
beforeAll(() => {
  routerService.addRoute({ path: '/foo', name: 'foo', component: NotificationsPage })
})
```
