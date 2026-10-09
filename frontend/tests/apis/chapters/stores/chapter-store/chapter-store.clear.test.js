import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  describe('clear', () => {
    it('clear resets the whole store', () => {
      const store = createChapterStore()
      store.setMainBranch(chapterSeeder.getMainBranch(2))
      store.setCurrentChapter(chapterSeeder.getChapter())

      store.clear()

      expect(store.mainBranch.value).toEqual([])
      expect(store.currentChapter.value).toBeUndefined()
    })
  })
})
