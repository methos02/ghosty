# TabsComponent + TabItem

```javascript
import TabsComponent from '@brugmann/vuemann/src/components/tabs/TabsComponent.vue'
import TabItem from '@brugmann/vuemann/src/components/tabs/TabItemComponent.vue'
```

**TabsComponent props:** `modelValue` (String, '' — v-model, active tab key)
**TabItem props:** `tabKey` (String, required), `label` (String, required), `icon` (String, optional FA class)
**Events:** `update:modelValue`

**Accessibility:** `role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`

Invalid modelValue → falls back to first tab. No TabItems → renders nothing.

```vue
<TabsComponent v-model="activeTab">
  <TabItem tabKey="profile" label="Profile" icon="fa-solid fa-user"><ProfileComponent /></TabItem>
  <TabItem tabKey="settings" label="Settings"><SettingsComponent /></TabItem>
</TabsComponent>
```

**CSS classes (global, overridable):** `.tabs`, `.tabs-header`, `.tabs-header__button`, `.tabs-header__button--active`, `.tabs-content`
