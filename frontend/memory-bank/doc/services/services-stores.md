# Services Store

`import { servicesStores } from '@brugmann/vuemann/src/services/services-stores.js'`

Generic, framework-agnostic registry that holds each service's `store` (refs + methods bundle) under the service name. Populated at app boot by `servicesInit.initServices` from the `store` field of each `*-init.js`. Helpers (`flash-helper.js`, `auth-helper.js`, etc.) read from it via `servicesStores.get(<name>)` at access time.

## Methods

- `servicesStores.register(serviceName, store)` — store the passed-in reference under `serviceName`. Subsequent `get(serviceName)` returns the same reference.
- `servicesStores.get(serviceName)` — return the registered store, or a lazily-created `{}` if no store has been registered yet. The empty fallback is stable (same reference on repeated calls before `register`).
- `servicesStores.reset()` — remove every registered entry. Test-only; use in `afterEach` to prevent leakage between tests.

## Why a registry at all

A service may have interchangeable implementations (e.g. a custom `auth` vs a default one) that keep isolated stores. Framework-level components must reach the **active** store without coupling to either implementation. The `services-stores` registry holds whatever the active service exposes via its `*-init.js`'s `store` field — switching implementations at the `init` level transparently moves the source of truth.

## Why lookup at access time (not capture)

`register(name, store)` replaces the registered reference. A consumer that captured the result of `get(name)` at import time (before registration) would freeze on the empty `{}` fallback and miss the registered store entirely.

The convention: per-service helpers (`<name>-helper.js`) call `servicesStores.get(<name>)` inside each getter, so the lookup resolves dynamically at every access. This keeps the registry simple (no proxy, no mutate-in-place tricks) and lets `vi.spyOn` propagate naturally — the registered store is the same reference as the singleton bag, so spying on a method of the singleton is visible through the registry.

## Constraints

- Pure JS. Does not import Vue. The values stored may be Vue refs, but the registry itself is framework-agnostic.
- A service registers its store **once** at app boot, via the `store` field on its `*-init.js`. Per-key registration is forbidden; the whole bundle is registered under the service name.
- Helpers must not capture `servicesStores.get(<name>)` at module load. Always look up inside getters.
