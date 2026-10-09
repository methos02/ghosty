---
paths:
  - "src/views/**/*.vue"
  - "src/components/ConfirmButtonComponent.vue"
---
# Confirm Destructive Actions

Every irreversible action goes through `ConfirmButtonComponent` (`src/components/`): the dialog carries the question and the confirm button runs the action through `LoaderComponent`. The question states the **real consequence** and adapts to the case (deleting a novel draft erases the novel, deleting a chapter draft erases a text).

Ghosty keeps a local copy of Vuemann's `ConfirmButtonComponent`, as for `DialogComponent` and `LoaderComponent`: the Vuemann one imports from the `@brugmann/vuemann` alias, absent from the project.

**BAD**

```vue
<button @click="deleteDraft(draft)">
  {{ t('draft.delete') }}
</button>
```

**GOOD**

```vue
<ConfirmButton
  :cb="deleteDraft"
  :params="[draft]"
  :question="t('draft.delete_confirm')"
>
  {{ t('draft.delete') }}
</ConfirmButton>
```
