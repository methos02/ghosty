---
paths:
  - "**/*"
---
# Root Cause First

Always trace the full execution path and fix at the source. Never mask symptoms.

Before applying any fix, answer: what exact line causes this, and why. If you cannot, keep investigating. Do not add workarounds (default services, global filters, wrapper layers) when the real cause is wrong operation order, a missing mock, or a wrong API call.

Treat each problem individually. A batch fix silencing 10 warnings at once is suspicious — each likely has its own distinct cause.
