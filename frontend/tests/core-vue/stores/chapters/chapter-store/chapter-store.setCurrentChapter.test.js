import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/core-vue/stores/chapters/chapter-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('chapter-store', () => {
  describe('setCurrentChapter', () => {
    it('setCurrentChapter stores the chapter being read', () => {
      const store = createChapterStore()
      const chapter = chapterSeeder.getChapter()

      store.setCurrentChapter(chapter)

      expect(store.currentChapter.value).toEqual(chapter)
    })
  })
})
