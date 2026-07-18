# BreadcrumbComponent

`import Breadcrumb from '@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue'`

**Props:** `type` (String, default `'config'`) — `'config'` (route metas) or `'session'` (dynamic via sessionStorage)

**Events:** `breadcrumb-click` (Boolean) — emitted on link click in session mode

## Config Mode

Add `breadcrumb` key in route `meta`: `{ name, route }` for parents. Vuemann traverses route hierarchy.

```javascript
// Hierarchy-based
{ path: "/components", meta: { breadcrumb: { name: 'Components', route: 'components' } }, children: [...] }

// Custom parents (override hierarchy)
meta: { breadcrumb: { label: 'Components', parents: [{ label: 'parent_1', route: 'parent1' }] } }
```

Usage: `<Breadcrumb />`

## Session Mode

Exposed methods (only work in session mode):
- `init(link?)` — reset breadcrumb, optionally add first link
- `add(link, routeName?)` — add `{ label, route, params }` link
- `refresh()` — reload from sessionStorage

```vue
<Breadcrumb ref="breadcrumb" type="session" />
```

## Link Structure

`{ label: String (required), route: String|Object (optional, not clickable if undefined), params: Object (optional) }`
