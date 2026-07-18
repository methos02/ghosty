---
paths:
  - "src/**/controllers/**/*.js"
  - "src/**/repositories/**/*.js"
  - "src/**/dtos/**/*.js"
  - "src/**/services/**/*.js"
---
# Pure JS Cannot Import Stores

Pure JS files (DTOs, Controllers, Repositories, Services) must never import Stores. Stores use Vue's `ref`/`readonly`; pure JS must remain framework-agnostic.

Import hierarchy: `.vue` -> Store -> Controller/Service -> Repository/DTO

```js
// GOOD - DTO imports Service (both pure JS)
import { GenreService } from '../services/genre-service.js'

// BAD - DTO imports Store (pure JS cannot import Vue)
import { genreStore } from '../stores/genre-store.js'
```
