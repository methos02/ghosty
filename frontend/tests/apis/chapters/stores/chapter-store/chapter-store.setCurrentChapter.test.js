import { describe, it, expect } from 'vitest'
import { createChapterStore } from '@/apis/chapters/stores/chapter-store.js'
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
