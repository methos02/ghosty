---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Facade Re-Exports

A module exports only its own symbols. Do not re-export symbols from a sibling module via a facade — call sites must import each module directly. Facades inflate the public surface, hide the real owner, and collect misleading "backward compatibility" comments that mask active call sites.

**Exception**: designated public entry points whose explicit role is to expose a curated API surface. Examples in vuemann:
- `src/shortcuts/services-shortcut.js` — public helper bundle for consumers
- `src/services/<name>/<name>-service.js` — service entry point that assembles its internal functions

```js
// BAD - facade re-exporting a sibling DTO's method from a regular module
export const NovelDto = {
    fromList,
    toSaveProposition,
    fromStatusList: NovelStatusDto.fromStatusList,
    toUpdateStatus: NovelStatusDto.toUpdateStatus,
}

// GOOD - each module owns and exports only its own symbols
import { NovelDto } from './novel-dto.js'
import { NovelStatusDto } from './novel-status-dto.js'

NovelDto.fromList(items)
NovelStatusDto.fromStatusList(statuses)
```
