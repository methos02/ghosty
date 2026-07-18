---
paths:
  - "**/*"
---
# Boy-Scout Cleanup On Touch

When you touch a file and find it violates an existing convention, bring the **whole file** up to standard in the same change — non-conformance is a defect to fix on sight, not to defer behind an "out of scope" excuse or a separate ticket.

Safe only if the public API and behavior stay identical and tests stay green. Never remove a stub or preview explicitly marked as temporary (e.g. `// ⚠️ TEMP PREVIEW`) — that requires explicit approval.

Scope limit: this covers **convention** non-conformance. A distinct functional defect discovered while working is reported, not bundled — see [fix-reported-symptom-only](fix-reported-symptom-only.md).
