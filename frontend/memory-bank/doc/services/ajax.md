# Ajax Service

HTTP requests (GET, POST, PUT, PATCH, DELETE).

`import { req, ajax, url } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

**Dependencies:** flash, locale, auth

## Configuration

- `src/config/routes-api-config.js` — API routes: `{ "route.name": { url, method, api } }`
- `src/config/app-config.js` — base URLs in `apis` property
- Dynamic params in URL: `{id}` → `v1/readers/{id}`
- `global` key for routes common to all APIs. Override with `"reader.api.status"`.
- Env vars: `VITE_API_{name}_URL`

## req(route_name, datas?, options?)

Main request function. Method determined by route definition.

**Options:** `params` (Object — URL params, extras become GET params), `token` (String — override bearer), `abort` (Bool — cancel duplicate), `flash` (Bool — suppress all error flashes), `no-flash` (Array — skip flash for specific status codes), `errors` (Object — custom error messages per status code `{ statusCode: 'translation_key' }`), `headers` (Object), `log` (Bool, true), `empty404` (Bool — treat 404 as empty array with status 200), `responseType` (String — e.g. `'blob'` for file downloads)

**Skipped-API guard:** if the target route's API declares `skip(context) === true` for the current user (see [auth](auth.md#conditional-api-skip-skip)), `req` short-circuits **before** any HTTP call — it flashes `api_forbidden_for_user`, persists `log.send('user_forbidden_api', …)`, and returns `{ api, route, status: FORBIDDEN, data: {} }`.

```javascript
req('users.show', { params: { id: 1 } })
req('users.create', { body: { email: 'test@example.com' } })
req('users.search', { params: { query: 'john' }, empty404: true })
req('users.validate', { body: { email: 'test' }, 'no-flash': [409] })
req('users.search', { params, errors: { 404: 'user_not_found' } })
```

### Blob / File Download

When `responseType: 'blob'` is set, `req()` returns a different response shape with the blob data and the filename extracted from the `Content-Disposition` header:

```javascript
// Repository
const download = async () => {
  return await req('reports.export', { responseType: 'blob' })
}

// Response shape: { api, route, status, data, filename, blob }
// - data/blob: the Blob object from the response
// - filename: extracted from Content-Disposition header (empty string if absent)
```

**Controller pattern for triggering download:**

```javascript
const download = async () => {
  const { status, blob, filename } = await repository.download()
  if (status !== STATUS.SUCCESS) { return }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
```

## URL Helpers

- `url.generateUrl(route_name, params, api)` — full URL
- `url.generateSubdirectory(route_name, params)` — subpath only

## HTTP Constants

`import { STATUS } from '@brugmann/vuemann/src/constants/ajax-constants.js'`

`SUCCESS` (200), `NO_CONTENT` (204), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `ERROR_SERVER` (500)

## AjaxHelpers

`import { AjaxHelpers } from '@brugmann/vuemann/src/helpers/ajax-helpers.js'`

- `AjaxHelpers.isAuthError(status)` — true if 401 or 403
- `AjaxHelpers.isSuccess(status)` — true if starts with 20x

## Architecture

Uses native `fetch` API (no external HTTP library). The HTTP client is in `src/services/ajax/src/models/http-client.js`.

Key internal functions (in `httpClientInternal`):
- `prepareFetchRequest` — applies request interceptor, builds fetch options and request config
- `sendFetch` — executes fetch, handles AbortError and network errors
- `handleFetchResponse` — normalizes response, delegates to response error interceptor on failure
- `createHttpError` — centralized HTTP error construction
- `normalizeResponse` — converts fetch Response to `{ data, status, headers, statusText }`
- `buildUrl` / `customParamsSerializer` — URL construction with query params

`rawRequest` — low-level fetch without interceptors, used for token refresh retry.

## Interceptors

- **Request**: adds headers, bearer token, abort duplicate requests, attaches requestId
- **Response**: auto token refresh on 401 expired, resends request with new token via `rawRequest`
- **Errors**: translated flash messages per status code (400→`error_bad_request`, 403→`error_forbidden`, 404→`error_not_found`, 422→`error_unprocessable`, 500→`error_server`, other→`error_unknown`). Customizable via `errors` option. `response.data.detail` is logged (not flashed). Auto logging (except 401/403/404), empty404 conversion
