---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
---
# No Facade Reexports

A module exports only its own symbols. MUST NOT re-export a sibling module's symbols through a facade: call sites import each module directly. A facade inflates the public surface, hides the real owner and collects "backward compatibility" comments that mask live call sites.

Exception: a designated public entry point whose explicit role is to expose a curated surface:
- `src/services/shortcuts/services-shortcut.js` (barrel of the service shortcuts);
- `src/services/<name>/<name>-service.js` (assembles the service's internal functions).

```js
// BAD
export const NovelDto = {
  fromList,
  fromGenreList: GenreDto.fromList,
}

// GOOD
import { NovelDto } from '@/apis/novels/dtos/novel-dto.js'
import { GenreDto } from '@/apis/genres/dtos/genre-dto.js'

NovelDto.fromList(items)
GenreDto.fromList(genres)
```
