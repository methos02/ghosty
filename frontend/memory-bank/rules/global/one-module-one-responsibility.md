---
paths:
  - "src/**/*.js"
---
# One Module, One Responsibility

A module's public API MUST answer **one** question. When its public functions split into two groups answering unrelated questions, extract each group into its own file, named after the question it answers (not after the code moved). Split on the first of:
- the public functions form two groups with no shared caller;
- one group's internals dominate the file and bury the other;
- the file cannot be named without listing two things (`reading-and-notification-helper`).

The resulting files form a one-way dependency chain: none imports another of the group. Test folders mirror the split (`tests/core/helpers/<helper-name>/<helper-name>.<method>.test.js`).

Example:

| File | Question it answers |
|---|---|
| `chapter-tree-helper` | how chapters link into a tree |
| `reading-layout-helper` | where a reading block goes: produces the layout |
| `reading-display-helper` | what a block looks like: consumes the layout |

## Do not pre-split by concern

MUST split only when a trigger above is met, never in anticipation.
