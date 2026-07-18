---
paths:
  - "src/**/*.js"
---
# One Module, One Responsibility

A module's public API must answer **one** question. When its public functions split into two groups answering unrelated questions, extract each into its own file — named after the question it answers, not after the code moved.

Split trigger (any one is enough):
- The public functions fall into two groups with no shared caller.
- One group's internals dominate the file and bury the other group.
- You cannot name the file without listing two things (`calendar-and-planning-helper`).

The resulting files form a **one-way dependency chain** — no two of them import each other. Test folders mirror the split (`tests/core/helpers/<helper-name>/<helper-name>.<method>.test.js`).

| File | Question it answers |
|---|---|
| `calendar-helper` | time and week conversions |
| `planning-layout-helper` | *where* a block goes — produces the segments |
| `planning-display-helper` | *what* a block looks like — consumes the segments |
