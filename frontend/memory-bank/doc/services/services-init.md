# Services Init

`import { servicesInit } from '@brugmann/vuemann/src/services/services-init.js'`

Single entry point that orchestrates everything at app boot — dependencies, stores, services, setup, plugins.

## Methods

- `servicesInit.initServices(app, servicesConfig)` —
  - first, in an upfront pass, registers every service's `routes` (if any) into the route registry, so they are available when the router builds regardless of init order
  - then, for each service in `servicesConfig`:
    1. resolves `dependencies` (re-entering `initService` for any not-yet-registered dep)
    2. registers `store` (if any) into `servicesStores`
    3. registers `services` (the methods bundle) into `servicesM`
    4. awaits `setup` (if any)
    5. installs the `plugin` (if any) on `app`

  This is the single canonical entry point for boot. `servicesM` no longer exposes `initServices`.

## Declaring routes from a service init

A service init may expose a `routes` field. It is aggregated by `getAllRegisteredRoutes()` (route registry) and injected into the router when it is built — so each service owns its own routes instead of relying on a central hardcoded list. The field is either:

- an **array** of route records (`utilsInit`, `logInit`), or
- a **function** returning route records, resolved lazily each time the router collects routes — use this for conditional routes. For example an `authInit` might expose its `/login` route only when `authService.requiresAuth()`, or declare `routes: []` so an app that handles auth elsewhere never registers the login page.

```js
export const myServiceInit = {
  services: myService,
  routes: myRoutes,           // array, or () => condition ? myRoutes : []
}
```

## Usage

```js
import { servicesInit } from '@brugmann/vuemann/src/services/services-init.js'
import { authInit } from '@brugmann/vuemann/src/services/auth/auth-init.js'
import { ajaxInit } from '@brugmann/vuemann/src/services/ajax/ajax-init.js'

await servicesInit.initServices(app, {
  ajax: ajaxInit,
  auth: authInit,
  // ...
})
```

## Migration from `servicesM.initServices`

Child apps must replace the direct `servicesM.initServices` call in their `main.js` with `servicesInit.initServices`. Without this swap, framework components that read cross-service refs through `servicesStores` (e.g. `auth.currentUserRef()` consumed by `HeaderComponent`) will silently fall back to empty refs.
