---
paths:
  - "src/views/**/*.vue"
---
# No Domain Word In Component Name

Before naming a component, grep the word in the domain: if it already denotes something else there (`end` of a branch), pick another. A block whose role is layout takes layout vocabulary (`Footer`, `Toolbar`, `Panel`), which cannot collide with the domain. Renaming a component renames its file, its test file and its BEM block together.

**BAD**

```
ChapterEnd.vue
```

**GOOD**

```
ChapterFooter.vue
```
