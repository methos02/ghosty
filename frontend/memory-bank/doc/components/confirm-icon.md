# ConfirmIconComponent

Icon/text with confirmation. Two modes: direct buttons or dialog.

`import IconConfirm from '@brugmann/vuemann/src/components/ConfirmIconComponent.vue'`

**Props:** `icon` (String, ''), `text` (String, ''), `cb` (Function, required), `params` (Array, []), `question` (String, '')

Define either `icon` or `text`, not both.

**States:** `init` → `confirm` (check/xmark icons) → `loading` (loader-spin)

**Without question:** click → check/xmark icons. Check runs cb, xmark resets.
**With question:** click → DialogComponent with question + Validate/Cancel.

**Data attributes (testing):** `data-confirm`, `data-valide`, `data-cancel`

```vue
<IconConfirm icon="fa-solid fa-trash" :cb="callback" />
<IconConfirm icon="fa-solid fa-trash" question="Are you sure?" :cb="callback" />
```
