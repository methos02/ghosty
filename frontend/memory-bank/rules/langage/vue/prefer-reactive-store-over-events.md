---
paths:
  - "src/**/*.vue"
  - "src/**/stores/**/*.js"
---
# Prefer Reactive Store Over Events

Use reactive composable stores so UI updates automatically. The component that calls an API owns the full consequence: error handling, flash, store update, cleanup.

```js
// BAD - event-based, split logic
const deleteSite = async (id) => { await SiteController.delete(id); emit('site-deleted', id) }
// parent must listen: <Child @site-deleted="onSiteDeleted" />

// GOOD - reactive store, child owns the full action
// site-store.js
const sites = ref([])
const removeSite = (id) => { sites.value = sites.value.filter(site => site.id !== id) }
export const useSiteStore = () => ({ sites: readonly(sites), removeSite })

// DeleteDialog.vue
const { removeSite } = useSiteStore()
const handleDelete = async (id) => {
    const result = await SiteController.delete(id)
    if (result.status !== STATUS.SUCCESS) { flash.errorT('error.key'); return }
    flash.successT('success.key')
    removeSite(id)
    close()
}
// ParentComponent.vue — no event handling needed
```

## When events are appropriate

- Component library boundaries (generic reusable components)
- Native user interactions (`@click`, `@submit`)
- Passing data to parent (form results, selections): `emit('save', customConfig)`
- Cross-feature communication where features should not know each other's stores
