import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  describe('clearCurrentChapter', () => {
    it('clearCurrentChapter resets only the chapter being read', () => {
      const store = createChapterStore()
      store.setMainBranch(chapterSeeder.getMainBranch(2))
      store.setCurrentChapter(chapterSeeder.getChapter())

      store.clearCurrentChapter()

      expect(store.currentChapter.value).toBeUndefined()
      expect(store.mainBranch.value).toHaveLength(2)
    })
  })
})
