---
paths:
  - "**/*"
---
# Boy-Scout Cleanup On Touch

## Convention violations: fix the whole file

When you touch a file that violates an existing convention, MUST bring the **whole file** up to standard in the same change. Non-conformance is a defect to fix on sight, not to defer behind "out of scope" or a separate ticket.

Safe only if the public API and the behaviour stay identical and the tests stay green. MUST NOT remove a stub, a preview or a `simulate*` function ([repository](../files-type/repository.md)) without explicit approval.

## Functional defects: report, do not bundle

MUST fix only the symptom actually observed. A **distinct functional defect** found along the way is reported to the developer and fixed only if asked: bundling inflates the diff and mixes an observed bug with a speculative one.

| Found while working | Action |
|---|---|
| Convention or style non-conformance in a touched file | Fix in the same change |
| Distinct functional defect | Report, fix only if asked |
