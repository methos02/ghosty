---
paths:
  - "src/**/services/**/*.js"
---
# Service Rules

Services orchestrate ≥2 controllers. Never call a controller from another controller — create a Service instead.

```
Component -> Service -> Controller A
                     -> Controller B
```

```js
// GOOD - service orchestrates controllers
const destroyWithNovels = async (chapterId, novelIds) => {
  const novelResult = await NovelController.destroys(novelIds)
  if (novelResult.status !== STATUS.SUCCESS) { return novelResult }
  return await ChapterController.destroy(chapterId)
}

export const NovelChapterService = { destroyWithNovels }

// BAD - controller imports another controller
import { NovelController } from './novel-controller.js'
```
