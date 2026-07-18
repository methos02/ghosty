---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# Module state in a container

Group **all** the module's mutable state in a single object **named `state`** — reassigned values AND in-place-mutated collections — and mutate its properties. Always `state`, even for one field: the name is the signal "this is module state, not a magic floating variable". Keep the *property* names descriptive (`state.counter`, `state.timerId`, not `state.value`). Never a top-level `let` reassigned from inside a function (also enforced by `unicorn/no-top-level-assignment-in-function`).

```js
// BAD — floating collections + a vaguely-named container
const messages = []
const counter = { value: 0 }

// GOOD — one `state` bag, descriptive properties
const state = { messages: [], counter: 0 }
const enqueue = m => { state.messages.push(m) }
const nextId = () => state.counter++
```

Same in `<script setup>` (timers, etc.): `const state = { timerId: undefined }`, `state.timerId = setTimeout(...)`.

One `state` per module: if a file hosts several exports, they share the single module-scope `state` (group their fields by descriptive name) rather than each declaring its own.
