---
paths:
  - "src/views/**/*.vue"
---
# Container / Presentation Split

When a component tests the same context discriminant (route name, mode) twice, split it into one container per context (`MultiverseChapterCard`, `ReadingChapterCard`), each carrying a single behaviour and rendering the same presentation component. The presentation component knows neither the route nor the context stores: it is the leaf that only renders, and is the one exception to `read-stores-not-props`.

- An action with the same meaning everywhere (open a summary, go to correction) is executed by the component itself through a composable or the router. An action whose meaning depends on the screen goes up to the container (emit or direct call from a dedicated container), never through a catch-all `actions` object or a list of function props.
- Containers pass the presentation component a **state** from a shared enumeration (`POPULARITY.NONE | NOVEL | BRANCH` in `constants/`), never an already-translated label. The presentation component alone maps state to text, and `t()` disappears from the containers. A boolean no longer fits once there are three cases.

**BAD**

```vue
<script setup>
const popularLabel = computed(() => (isPopular.value ? t('badge.popular') : ''))
</script>
<template>
  <ChapterCardView :popular-label="popularLabel" />
</template>
```

**GOOD**

```vue
<template>
  <ChapterCardView :popularity="POPULARITY.BRANCH" />
</template>
```
