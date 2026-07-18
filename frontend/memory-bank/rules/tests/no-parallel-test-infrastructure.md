---
paths:
  - "tests/**/*.test.js"
---
# No Parallel Test Infrastructure

Tests use the infrastructure set up by `setupVuemannTests` (global router, real i18n keys, services manager). Never create local substitutes that shadow the real app infrastructure.

If the global setup is missing something, extend `setup-vuemann-tests.js` or register the missing piece locally (routes, locale keys) — don't build a parallel system.

| Violation | Fix |
|-----------|-----|
| `createRouter(...)` in a test file | Use the global router from `setupVuemannTests`. Add routes via `routerService.addRoute(...)` in `beforeAll`. |
| Literal strings passed to `t()` or used as i18n keys (`'app-test'`, `'Home'`, `'My custom message'`) | Register in `src/locales/{lang}/dev-{lang}.json` with `test_` prefix (flat snake_case). Dev locales are in `.npmignore`, not shipped to child apps. |

```js
// BAD - local router + literal i18n key
const router = createRouter({ history: createWebHistory(), routes: [...] })
const wrapper = mount(Comp, { global: { plugins: [router] } })
expect(wrapper.html()).contains('Api Init') // 'Api Init' used as t() key somewhere

// GOOD - extend global setup
// in beforeAll: routerService.addRoute({ path: '/foo', name: 'foo', component: ... })
// in src/locales/fr/dev-fr.json: "test_api_init": "Api Init"
// in test: { label: 'test_api_init' }
```
