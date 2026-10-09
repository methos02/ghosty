import { describe, it, expect } from 'vitest'
import { createReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('reading-store', () => {
  describe('setReading', () => {
    it('setReading stores the chapter with its thread and its children', () => {
      const store = createReadingStore()
      const reading = chapterSeeder.getReading()

      store.setReading(reading)

      expect(store.chapter.value).toEqual(reading.chapter)
      expect(store.ancestors.value).toEqual(reading.ancestors)
      expect(store.children.value).toEqual(reading.children)
      expect(store.nextChapterId.value).toBe(reading.nextChapterId)
    })
  })
})
