---
paths:
  - "src/core/**"
  - "src/core-vue/**"
---
# Core Vs Core-Vue Split

`src/core/**` is pure JS (helpers): it must not import Vue. `src/core-vue/**` is Vue-dependent (composables) and may. Vue-free helpers live in `src/core/helpers/`, not in a `src/helpers/` folder.
