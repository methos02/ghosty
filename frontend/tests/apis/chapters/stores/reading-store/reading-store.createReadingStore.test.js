import { describe, it, expect } from 'vitest'
import { createReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { chapterSeeder } from '&/utils/seeders/chapter-seeder.js'

describe('reading-store', () => {
  describe('createReadingStore', () => {
    it('creates isolated stores per call (request-scoped)', () => {
      const storeA = createReadingStore()
      const storeB = createReadingStore()

      storeA.setReading(chapterSeeder.getReading())

      expect(storeB.chapter.value).toBeUndefined()
    })
  })
})
