# Router Service

`import { router, route } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

**Dependencies:** vue-router, auth, utils

## Configuration

Routes in `src/config/route-config.js`. Meta options: `roles` (Array — OR logic, redirect "/" if no match), `title` (String — sets document.title), `breadcrumb` (Array).

ScrollBehavior: anchors (smooth scroll), saved position (back/forward), scroll to top (default).

## router Methods

- `router.push(route)` — navigate (String or Object)
- `router.replace(route)` — navigate without adding a history entry (String or Object)
- `router.hasRoute(name)` — check existence
- `router.getRoutes()` — all routes
- `router.addRoute(route)` — add route (requires `path` + `component`)
- `router.resolve(route)` — resolve a full `RouteLocationRaw` (name + params + query) to a route object; use `.href` for `window.open(router.resolve(route).href, '_blank')`

## route Methods

- `route.current()` — current route object
- `route.get(param_name)` — get param (searches params then query); returns `undefined` for empty values (optional params `:id?` accessed without value)
- `route.has(param_name)` — check param exists (treats empty values as absent)

## Other Methods

- `redirectAfterLogin()` — redirect to intended URL post-login
- `hasApiRoute(name)` — check if API route exists in routes-api-config
- `getRoute(name)` — get route by name

## Router Store

`import { useRouterStore } from '@brugmann/vuemann/src/services/router/src/router-store.js'`

`urlIntented` (Ref, '/') — URL user tried to access before redirect.

## Navigation Guards

**beforeEach**: 1) Allow 'error' route 2) Block `/documentation/*` routes if auth required and user not authenticated (redirect to login, store intended URL) 3) Check meta.roles (OR logic) 4) Redirect "/" with warning if no role match.
**afterEach**: Updates document.title from meta.title.

Service routes loaded automatically via `getServiceRoutes()`. Route validation on addRoute/push.

## Catch-all (Unknown URL)

Built-in catch-all route `not-found` (`/:pathMatch(.*)*`) appended as last entry. Unknown URLs redirect to `/` and fire `flash.errorT('error_url_unknown', { url })`. Zero config in child apps. Child-app catch-all routes, if any, match first (declared before the Vuemann catch-all).
