---
paths:
  - "src/**/*.vue"
---
# Show Message On Missing Optional Data

MUST render a localized message in place of an empty block **only** when its absence would leave a navigation target visibly broken. Apply when ALL hold:
1. the block is the **primary content** of a navigation target the user actively opened (a tab, a route, a dialog, a panel);
2. its render is gated by an optional field of the parent object (`v-if="parent.optionalField..."`);
3. without the data the target renders empty or near-empty.

MUST NOT apply to inline optional details (`user.avatar`, `chapter.summary` in a card): skip them.

```vue
<!-- BAD -->
<div v-if="chapter.reports?.length" class="reports-tab">…</div>

<!-- GOOD -->
<p v-if="!chapter.reports?.length" class="no-data">
  {{ t('chapter.reports.empty') }}
</p>
<div v-if="chapter.reports?.length" class="reports-tab">…</div>
```

When the rule applies, guard at every entry point that can mount the block (initial mount, tab click, deep link, store-driven watcher) and add the translation key in every locale.
