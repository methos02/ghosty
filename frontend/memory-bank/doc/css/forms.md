# Forms

`.form-row` — distributes children equally, 25px gap, 20px mb. Column on <768px. `.half` = 50% width.
`.form-input` + `.form-label` — floating label via `:focus`/`:not(:placeholder-shown)`. Needs `.p-relative` container, `placeholder=" "`. `.form-label.required` adds asterisk.
`.form-error` — error text below input.
`.form-group` — links elements (input+button), rounds first/last corners.
`.no-label` — directly on the `.input` or `.form-input` element, removes the top padding reserved for the floating label. All input components expose a `noLabel` prop. `SelectComponent` also auto-applies when `label` is empty.

```html
<!-- Via prop on any input component -->
<InputComponent name="search" noLabel />
<SelectComponent name="type" noLabel />
<TextareaComponent name="notes" noLabel />

<!-- On a raw element -->
<select class="input no-label">...</select>
<input class="form-input input no-label" />
```

```html
<div class="p-relative">
  <input class="form-input input" placeholder=" " />
  <label class="form-label required">Label</label>
  <p class="form-error">Error</p>
</div>
```
