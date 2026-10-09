import { describe, it, expect } from 'vitest'
import { createReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('reading-store', () => {
  describe('clear', () => {
    it('clear empties the reading', () => {
      const store = createReadingStore()
      store.setReading(chapterSeeder.getReading())

      store.clear()

      expect(store.chapter.value).toBeUndefined()
      expect(store.ancestors.value).toEqual([])
      expect(store.children.value).toEqual([])
      expect(store.nextChapterId.value).toBeUndefined()
    })
  })
})
