# Locale Service

Translation system: French (default), Dutch, English.

`import { t, locale } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

**Dependencies:** vue-i18n (Composition API), flash. Requires `localeVite` plugin in vite.config.js.

## Configuration

Languages in `src/config/locale-config.js`: `{ fr: 'Français', nl: 'Nederlands', en: 'English' }`

Locale persisted in `localStorage` key `'locale'`.

## Translation Files

JSON key/value pairs in `src/locales/{lang}/`. Dynamic params: `"hello": "Hello {name}!"` → `t('hello', { name: 'John' })`. Also: `t('key:name=John|age=20')`.

Vite plugin auto-compiles from: `./src/locales/`, `./src/apis/*/locales/`, `./src/services/*/locales/`, `node_modules/@brugmann/vuemann/src/...`. Auto-versioning, HMR, cleanup.

## Methods

- `t(key, params?)` — translate
- `locale.t(key, params?)` — same
- `locale.current()` — current locale string (non-reactive)
- `localeStore.currentRef` — Vue reactive ref (for components/computed/watch)

## Events

`locale-changed` CustomEvent on `globalThis`, `detail` = new locale code.

## Programmatic Change

```javascript
localeStore.set(newLocale)
globalThis.dispatchEvent(new CustomEvent('locale-changed', { detail: newLocale }))
await localeFunctions.loadLocaleMessages(newLocale)
locale.value = newLocale
```
