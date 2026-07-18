# ConfirmButtonComponent

Button with confirmation. Two modes: inline and dialog.

`import ConfirmButton from '@brugmann/vuemann/src/components/ConfirmButtonComponent.vue'`

**Slot:** default — button content (inside LoaderComponent)

**Props:** `cb` (Function, required), `params` (Array, []), `question` (String, '')

**Inline** (`question === ''`): click → Validate/Cancel buttons → Validate runs cb + resets, Cancel resets.
**Dialog** (`question !== ''`): click → DialogComponent with question → Validate runs cb + closes, Cancel closes.

LoaderComponent wraps button: auto loader during async cb.

```vue
<ConfirmButton :cb="callback">Delete</ConfirmButton>
<ConfirmButton :cb="callback" question="Are you sure?">Delete</ConfirmButton>
```
