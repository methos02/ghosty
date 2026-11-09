---
paths:
  - "src/views/**/*.vue"
  - "src/components/**/*.vue"
---
# Translate In Template

A fixed text MUST be translated in the template, where it is displayed. MUST NOT call `t()` in a `computed` or a function of `<script setup>` to build a label.

- Text that depends on a condition: `v-if` / `v-else` in the template, one `t()` per branch.
- Attribute that depends on a condition (`title`, `aria-label`): the script picks the **key** (`labelKey`), the template calls `t(labelKey)`.
- A child component that only accepts its text as a prop exposes a named slot instead (`DialogComponent` → `#title`).

Exception: a message set from an event handler (refusal, error returned by the API) is state, not a label: it stays in the script.

**BAD**

```js
const label = computed(() => (isOpen.value ? t('header.menu_close') : t('header.menu_open')))
```

**GOOD**

```js
const labelKey = computed(() => (isOpen.value ? 'header.menu_close' : 'header.menu_open'))
```

```vue
<button :aria-label="t(labelKey)">
```

**BAD**

```js
const popularLabel = computed(() => {
  if (props.popularity === POPULARITY.NOVEL) {
    return t('common.main_branch')
  }

  return ''
})
```

**GOOD**

```vue
<span v-if="popularity === POPULARITY.NOVEL">{{ t('common.main_branch') }}</span>
```
