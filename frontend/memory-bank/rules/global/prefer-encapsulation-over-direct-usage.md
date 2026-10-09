---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Prefer Encapsulation Over Direct Usage

MUST NOT use a framework or library API directly when a project wrapper exists; if none exists, create one. The wrapper is the contract: the implementation can change without touching consumers.

```js
// BAD
{{ $t('error_not_found') }}

// GOOD
import { t } from '@/services/shortcuts/services-shortcut.js'
{{ t('error_not_found') }}
```

## Library components

A library component (vue-i18n `<i18n-t>`) is wrapped in a project component (`src/services/locale/views/TranslateComponent.vue`, imported as `Translate`). Views use only the wrapper.

```vue
<!-- BAD -->
<i18n-t keypath="like_received_notification.one" tag="span" scope="global">…</i18n-t>

<!-- GOOD -->
<Translate keypath="like_received_notification.one">…</Translate>
```

## Accept the shortcut's narrower API

Reach project services through `services-shortcut.js`. If the shortcut exposes a narrower API than the raw service, MUST work within it, never import the raw service to recover a missing method.

```js
// BAD
import { getRouter } from '@/services/router/src/router-plugin.js'
const href = getRouter().resolve({ name: 'home', query }).href

// GOOD
import { router } from '@/services/shortcuts/services-shortcut.js'
router.push({ name: 'home', query })
```

## Translation belongs in the view

Pure JS (helpers, DTOs, services) returns an i18n **key** (or the `key:param=value|param2=value2` string `t` parses), never a finished phrase. Only the view calls `t`. Exception: JS may translate an inner sub-token passed as a param, as long as the outer phrase stays a key.

```js
// BAD
const formatSummary = notification => t('summary.like', { count: notification.count })

// GOOD
const formatSummary = notification => `summary.like:count=${notification.count}`
```

The template renders it with `{{ t(notification.summaryFormat) }}`.
