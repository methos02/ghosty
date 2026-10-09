---
paths:
  - "package.json"
  - "package-lock.json"
---
# No Version Bump

MUST NOT modify the `version` field of `package.json` or `package-lock.json`. The user or the release tooling handles versioning. MUST NOT put a "bump version" step in a plan, nor bump after applying a fix.
