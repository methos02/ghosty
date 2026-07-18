---
paths:
  - "src/**/*.vue"
---
# Show Message On Missing Optional Data

Render a localized message in place of an empty block **only** when its absence would leave a navigation target visibly broken.

**Apply when ALL hold**:
1. The block is the **primary content** of a navigation target the user actively opened — a tab, a route, a dialog, a panel.
2. Its render is gated by an optional field on the parent object (`v-if="parent.optionalField..."`).
3. Without the data, that target renders empty or near-empty (no other meaningful content to fall back on).

**Do NOT apply** to inline optional details (`user.middleName`, `address.line2`, an avatar, a phone) — just skip them. The rule targets *the block the user came to see*, not every optional field.

```vue
<!-- BAD - user clicks the "Subscription" tab and sees a blank panel -->
<div v-if="user.subscription?.plan" class="subscription-tab">
  …
</div>

<!-- GOOD - the tab explains why it is empty -->
<div v-if="!user.subscription" class="no-data">
  {{ t('user.subscription.requires_active_account') }}
</div>
<div v-if="user.subscription?.plan" class="subscription-tab">
  …
</div>
```

When the rule applies, guard at every entry point that can mount the block (initial mount, tab click, deep link, store-driven watcher) and add the translation key in every locale.
