---
paths:
  - "src/views/**/*.vue"
  - "src/apis/**/composables/*.js"
---
# Global Dialog, Single Instance

A dialog openable from anywhere follows the `useAuth()` / `<LoginDialog />` pattern: a composable holds the open state, the component reads it, and the component is mounted **once** in the layout. Any component opens it by calling the composable, with no prop and no emit. Do not mount it per parent or per card (one instance per item).

The state is shared: tests reset it in `afterEach`.

**BAD**

```vue
<SummaryDialog ref="summaryDialog" />
```

**GOOD**

```js
const { openSummary } = useSummaryDialog()
```
