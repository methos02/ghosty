---
paths:
  - "src/views/**/*.vue"
---
# Read Stores, Not Props

A view component reads the stores it needs itself. A prop is justified only for data the caller alone knows (the current item of a loop) or for a state that exists only in the calling context. Exception: the presentation leaf of a container split receives its state as a prop (`container-presentation-split`). The page is not a conveyor belt, and an intermediate component does not forward props it merely crosses.

Cost to accept: every mount in a test must provide the injected stores. If a component needs many of them, check it does not draw too much.

**BAD**

```vue
<ReadingToolbar
  :novel-slug="novel.slug"
  :novel-title="novel.title"
/>
```

**GOOD**

```vue
<ReadingToolbar />
```
