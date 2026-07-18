---
paths:
  - "**/*"
---
# Fix The Reported Symptom Only

Fix only the symptom actually observed. A **separate functional defect** found along the way is *reported* to the developer, never silently bundled into the same change — bundling inflates the diff and mixes an observed bug with a speculative one.

Boundary with [boy-scout-cleanup-on-touch](boy-scout-cleanup-on-touch.md): convention or style non-conformance in a file you touch → fix it in the same change. A distinct functional defect → report it, fix it only if asked.
