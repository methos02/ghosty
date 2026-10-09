import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  describe('hydrate', () => {
    it('hydrate restores a serialized state', () => {
      const store = createChapterStore()
      const branch = chapterSeeder.getMainBranch(2)

      store.hydrate({ mainBranch: branch, currentChapter: branch[0] })

      expect(store.mainBranch.value).toEqual(branch)
      expect(store.currentChapter.value).toEqual(branch[0])
    })

    it('hydrate ignores an empty payload', () => {
      const store = createChapterStore()

      store.hydrate(undefined)

      expect(store.mainBranch.value).toEqual([])
    })
  })
})
