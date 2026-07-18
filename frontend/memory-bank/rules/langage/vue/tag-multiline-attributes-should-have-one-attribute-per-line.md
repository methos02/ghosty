---
paths:
  - "src/**/*.vue"
---
# One Attribute Per Line

Multiple attributes on a tag = one per line. Single attribute can stay inline.

```vue
<!-- BAD -->
<input type="text" class="input" v-model="query" @input="onSearch">

<!-- GOOD -->
<input
    type="text"
    class="input"
    v-model="query"
    @input="onSearch"
>

<!-- OK - single attribute -->
<div class="container">
<button @click="submit">
```
