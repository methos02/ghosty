---
paths:
  - "src/**/*.vue"
---
# Interpolation On Own Line

MUST format an element whose content is a `{{ ... }}` interpolation on three lines: opening tag, indented content, closing tag. Applies to every element (`span`, `h1`-`h3`, `th`, `td`, `div`, `p`, `button`...). Targets element **content**, not attributes (Prettier's `singleAttributePerLine` handles those).

```vue
<!-- BAD -->
<span class="label">{{ t('field.title') }}</span>
<h3>{{ t('chapters') }} ({{ count }})</h3>

<!-- GOOD -->
<span class="label">
  {{ t('field.title') }}
</span>
<h3>
  {{ t('chapters') }} ({{ count }})
</h3>
```

Accepted cost: **not tool-enforced**. Prettier (`htmlWhitespaceSensitivity: ignore`) collapses short elements such as `<h3>{{ x }}</h3>` onto one line when they fit `printWidth` (verified), so `npm run format` can undo the rule and the repository mixes both forms. Enforcement relies on review.
