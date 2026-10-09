import { describe, it, expect } from 'vitest'
import { createReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('reading-store', () => {
  describe('hydrate', () => {
    it('hydrate restores what serialize produced', () => {
      const source = createReadingStore()
      source.setReading(chapterSeeder.getReading())
      const target = createReadingStore()

      target.hydrate(source.serialize())

      expect(target.chapter.value).toEqual(source.chapter.value)
      expect(target.nextChapterId.value).toBe(source.nextChapterId.value)
    })
  })
})
