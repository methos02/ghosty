---
paths:
  - "src/**/*.vue"
---
# Handler Named After Its Effect

Name a handler after the effect it produces (`openChapterReport`, `toggleNightMode`), never after the business action it merely starts. A handler whose whole body forwards one call to a store or composable is deleted, not renamed: the template calls the target directly, arguments included.

**BAD**

```vue
<script setup>
const report = () => {
  openChapterReport(chapter.value)
}
</script>
<template>
  <button @click="report">
</template>
```

**GOOD**

```vue
<template>
  <button @click="openChapterReport(chapter)">
</template>
```
