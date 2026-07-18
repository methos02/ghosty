# DropdownComponent

`import Dropdown from '@brugmann/vuemann/src/components/DropdownComponent.vue'`

**Dependencies:** `vOnClickOutside` (@vueuse/components)

**Slots:** `button` (trigger, auto-toggle if enabled), `items` (dropdown content)

**Props:** `classes` (String, ''), `orientation` (String, '' — 'left'|'right' horizontal alignment), `autoToggle` (Boolean, true)

**Methods:** `show()` (async), `hide()`, `toggle(state?)`

**Events:** `show`, `hide`

Click outside auto-closes. Vertical direction (top/bottom) is auto-detected on `show()`: if space below the trigger is less than the dropdown height, it opens upward.

```vue
<Dropdown classes="left">
  <template #button><button class="btn btn-primary">Click</button></template>
  <template #items><ul class="f-column g-5"><li>item</li></ul></template>
</Dropdown>
```

Manual toggle: `:autoToggle="false"`, use ref + `.stop` modifier.
