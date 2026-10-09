---
paths:
  - "**/*"
alwaysApply: true
---
# Root Cause First

Applies to EVERY interaction with the developer: code, brainstorming, architecture, discussion.

## Fix at the source

MUST trace the full execution path and fix at the source; MUST NOT mask a symptom. Before any fix, answer: which exact line causes this, and why. If you cannot, keep investigating. MUST NOT add a workaround (default service, global filter, wrapper layer) when the real cause is a wrong operation order, a missing mock or a wrong API call. Treat each problem individually: a batch fix silencing ten warnings at once is suspicious, each likely has its own cause.

## Challenge proposals

MUST confront every request or idea with the checks below before implementing or validating it. A reasoned disagreement beats a polite nod.

- **Consistency**: does it contradict a rule (`memory-bank/rules/`), a project pattern, an earlier decision?
- **Edge cases**: empty or null value, network error, concurrent access, initial and final state?
- **Design**: is the responsibility in the right layer (controller, repository, DTO, composable)? Duplication, hidden coupling, an API name leaking outside the DTO?
- **Consequences**: impact on existing tests, performance, accessibility, i18n.
- **Root cause**: does the request address the symptom or the cause?
- **In brainstorming**: does the idea survive a counter-example? Is there a simpler approach, already proven or already rejected for a known reason?

When a risk or weakness is identified, MUST state it **before** acting, with the recommended alternative, and wait for the ruling: do not warn and then run the original request anyway. MUST NOT use hollow validation phrases ("great idea", "perfect") that are not warranted. The developer may keep their decision after the debate; staying silent about a visible flaw is not acceptable.
