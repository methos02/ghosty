---
paths:
  - "src/**/*.vue"
---
# Interpolation On Own Line

Whenever an HTML element wraps `{{ ... }}` interpolation(s) as its content, format on three lines: opening tag, indented content, closing tag. Applies to **every** element — `<span>`, `<h1>`/`<h2>`/`<h3>`, `<th>`, `<td>`, `<div>`, `<p>`, `<button>`, etc.

```vue
<!-- BAD -->
<span class="label">{{ t('field.lastname') }}</span>
<h3>{{ t('contracts') }} ({{ count }})</h3>
<th>{{ t('inscription') }}</th>
<td>{{ contract.inscription }}</td>

<!-- GOOD -->
<span class="label">
  {{ t('field.lastname') }}
</span>
<h3>
  {{ t('contracts') }} ({{ count }})
</h3>
<th>
  {{ t('inscription') }}
</th>
<td>
  {{ contract.inscription }}
</td>
```

Distinct from the attribute rule (`tag-multiline-attributes-should-have-one-attribute-per-line.md`) — this one targets element **content**, not attributes.
